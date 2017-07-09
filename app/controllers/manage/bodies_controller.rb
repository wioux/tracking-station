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
      group = Hash.new("Other")
      group["Star"] = "Stars"
      group["Planet"] = "Planets"
      group["Minor Planet"] = "Planets"
      group["Moon"] = "Moon"
      group["Spacecraft"] = "Spacecraft"

      search = Body.where("LOWER(name) LIKE ?", "%#{params[:f]}%".downcase)
      @bodies_results = search.map do |body|
        body.as_json.merge(
          "url" => manage_body_path(body.id),
          "group" => group[body.classification]
        )
      end
    end
  end
end
