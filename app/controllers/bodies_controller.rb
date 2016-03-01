class BodiesController < ApplicationController
  def index
    render json: Body.all, include: :ephemeris
  end

  def browser
  end
end
