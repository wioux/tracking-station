class BodiesController < ApplicationController
  before_action :collect_body_ids_from_friendly_params

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
        system = requested_system.as_json(
          only: [:id, :parent_id, :name, :classification,
                 :radius_km, :inner_ring_radius_km, :outer_ring_radius_km,
                 :north_pole_right_ascension, :north_pole_declination,
                 :color, :texture, :ring_texture, :sprite],
          methods: [:marked_up_info, :timeline_events]
        )

        system.each do |body|
          body["ephemerides_url"] = body_ephemerides_path(body["id"], format: 'json')
        end

        render json: system
      end
    end
  end

  private

  def requested_system
    # include info for body
    bodies = [@body]

    if params.key?(:bodies)
      bodies += Body.where(id: params[:bodies]).preload(:timeline_events)
    else
      # include info for body's moons
      bodies += Body.where(parent_id: @body).preload(:timeline_events)

      # include info for satellites of body or its moons
      bodies += Body.joins(:ephemerides).
               where(ephemerides: { central_body_id: bodies }).
               select("bodies.*").distinct.
               preload(:timeline_events)
    end

    bodies.tap(&:uniq!)
  end

  def collect_body_ids_from_friendly_params
    if params[:planets]
      params[:bodies] = Array(params[:bodies]).concat(Body.planets.pluck(:id))
    end
  end
end
