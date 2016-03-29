require 'net/http'

module Horizons
  class Import
    attr_reader :body, :center

    def initialize(body, center: body.parent)
      if center.nil?
        raise Exception.new("center must be given when body.parent is nil")
      end

      @body = body.horizons_id
      @center = center.horizons_id

      raise Exception.new("body.horizons_id is nil") if @body.blank?
      raise Exception.new("center.horizons_id is nil") if @center.blank?
    end

    # start_time -- Time or "%Y-%m-%d" string
    # stop_time  -- Time or "%Y-%m-%d" string
    # step       -- ActiveSupport::Duration or "7 days" etc
    def fetch(start_time, stop_time, step)
      start_time = start_time.strftime('%Y-%m-%d') unless start_time.is_a?(String)
      stop_time = start_time.strftime('%Y-%m-%d') unless stop_time.is_a?(String)
      step = step.inspect[/\d+ \w/] unless step.is_a?(String)

      response = self.class.get_horizons_response(body, center, start_time, stop_time, step)

      self.class.parse_csv(response) do |elements|
        yield(elements)
      end
    end

    protected

    def self.get_horizons_response(body_id, center_id, start_time, stop_time, step)
      FileUtils.mkdir_p("#{Rails.root}/tmp/horizons")
      cache = "#{Rails.root}/tmp/horizons/#{center_id}-#{body_id}-#{start_time}-#{stop_time}-#{step}.txt"

      unless File.exist?(cache)
        uri = URI("http://ssd.jpl.nasa.gov/horizons_batch.cgi?batch=1" <<
                  "&MAKE_EPHEM='YES'&TABLE_TYPE='ELEMENTS'&OUT_UNITS='AU-D'" <<
                  "&COMMAND='#{body_id}'&CENTER='#{center_id}'&CSV_FORMAT='YES'" <<
                  "&START_TIME='#{start_time}'&STOP_TIME='#{stop_time}'&STEP_SIZE='#{step}'")

        response = Net::HTTP.get_response(uri)

        unless response.code == '200'
          raise Exception("horizons(#{body}, #{center}, " <<
                          "#{start_time}, #{stop_time}, #{step}) " <<
                          "responded HTTP #{response.code}")
        end

        File.open(cache, 'w'){ |f| f.write(response.body) }
      end

      File.read(cache)
    end

    def self.parse_csv(csv)
      csv_section = false
      csv.each_line do |line|
        next unless csv_section || line =~ /SOE/

        csv_section = true
        next if line =~ /SOE/
        return if line =~ /EOE/

        fields = line.split(/\s*,\s*/)
        elements = {}.tap do |elements|
          %w(jd date ec qr inc om
             w tp n ma ta a ad pr).each_with_index do |key, i|
            elements[key] = fields[i].to_f unless key == 'date'
          end
        end
        yield(elements)
      end
    end
  end
end
