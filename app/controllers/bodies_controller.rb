class BodiesController < ApplicationController
  def index
    bodies = Body.preload(:ephemerides)
    render json: bodies,
           only: [:id, :parent_id, :name, :classification,
                  :radius_km, :inner_ring_radius_km, :outer_ring_radius_km,
                  :north_pole_right_ascension, :north_pole_declination,
                  :color, :texture, :ring_texture, :sprite
                 ],
           methods: [:ephemerides, :marked_up_info]
  end

  def browser
  end
end
