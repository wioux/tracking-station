
module Horizons
  module Support
    def import_horizons_data(start_time, stop_time, step, center: parent)
      horizons = Horizons::Import.new(self, center: center)
      horizons.fetch(start_time, stop_time, step) do |elements|
        ephemerides.create!(elements.merge(central_body_id: center.id))
      end
    end
  end
end
