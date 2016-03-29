class BodiesController < ApplicationController
  def index
    @body = Body.find_by!(classification: 'Star')
    @satellite_ids = params[:bodies] if params.key?(:bodies)
  end

  def show
    @body = Body.find(params[:id])
    @satellite_ids = params[:bodies] if params.key?(:bodies)

    respond_to do |format|
      format.html
      format.json do
        render json: requested_system,
               only: [:id, :parent_id, :name, :classification,
                      :radius_km, :inner_ring_radius_km, :outer_ring_radius_km,
                      :north_pole_right_ascension, :north_pole_declination,
                      :color, :texture, :ring_texture, :sprite
                     ],
               methods: [:ephemerides, :marked_up_info, :timeline_events]
      end
    end
  end

  private

  def requested_system
    # include info for body
    bodies = [@body]

    if params.key?(:bodies)
      bodies += Body.where(id: params[:bodies]).preload(:ephemerides, :timeline_events)
    else
      # include info for body's moons
      bodies += Body.where(parent_id: @body).preload(:ephemerides, :timeline_events)

      # include info for satellites of body or its moons
      bodies += Body.joins(:ephemerides).
               where(ephemerides: { central_body_id: bodies }).
               select("bodies.*").distinct.
               preload(:ephemerides, :timeline_events)
    end

    bodies.uniq!
  end
end
