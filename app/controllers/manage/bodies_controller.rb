module Manage
  class BodiesController < ApplicationController
    layout "manage_bodies"

    before_action :set_bodies_results

    def index
    end

    def show
      @body = Body.find(params[:id])
      render layout: (request.xhr? ? nil : "manage_bodies")
    end

    def search
      render json: { results: @bodies_results }
    end

    private

    def set_bodies_results
      @bodies_results =
        Body.where("LOWER(name) LIKE ?", "%#{params[:f]}%".downcase)
        .as_json.map{ |json| json.merge("url" => manage_body_path(json["id"])) }
    end
  end
end
