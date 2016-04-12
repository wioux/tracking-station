class EphemeridesController < ApplicationController
  def index
    render json: Body.find(params[:body_id]).ephemerides
  end
end
