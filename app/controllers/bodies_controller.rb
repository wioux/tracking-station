class BodiesController < ApplicationController
  def index
    render json: Body.preload(:ephemerides), include: :ephemerides
  end

  def browser
  end
end
