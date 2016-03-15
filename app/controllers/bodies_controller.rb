class BodiesController < ApplicationController
  def index
    @body ||= Body.find_by!(classification: 'Star')
  end

  def show
    @body ||= Body.find(params[:id])

    respond_to do |format|
      format.html
      format.json do
        # include info for body
        bodies = [@body]

        # include info for body's moons
        bodies += Body.where(parent_id: @body).preload(:ephemerides, :timeline_events)

        # include info for satellites of body or its moons
        bodies += Body.joins(:ephemerides).
                 where(ephemerides: { central_body_id: bodies }).
                 select("bodies.*").distinct.
                 preload(:ephemerides, :timeline_events)

        bodies.uniq!

        render json: bodies,
               only: [:id, :parent_id, :name, :classification,
                      :radius_km, :inner_ring_radius_km, :outer_ring_radius_km,
                      :north_pole_right_ascension, :north_pole_declination,
                      :color, :texture, :ring_texture, :sprite
                     ],
               methods: [:ephemerides, :marked_up_info, :timeline_events]
      end
    end
  end
end
