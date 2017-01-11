class Body < ActiveRecord::Base
  include Horizons::Support

  belongs_to :parent, class_name: 'Body'
  has_many :ephemerides, foreign_key: :satellite_id
  has_many :timeline_events

  markdown_extensions =
    [
      :no_intra_emphasis, :tables, :fenced_code_blocks,
      :autolink, :strikethrough, :space_after_headers,
      :superscript, :highlight, :footnotes, :hard_wrap
    ].map{ |x| [x, true] }

  markdown_renderer = Redcarpet::Render::HTML.new(
    :filter_html => true,
    :no_styles => true,
    :link_attributes => {'data-external' => true}
  )

  Markdown = Redcarpet::Markdown.new(markdown_renderer,
                                     Hash[markdown_extensions])

  scope :spacecraft, ->{ where(classification: 'Spacecraft') }

  def self.named(name)
    find_by(name: name)
  end

  def self.sun
    find_by!(name: 'Sun')
  end

  def marked_up_info
    Markdown.render(info) if info
  end

  def ephemeris
    ephemerides.take
  end

  def encounters
    if classification == "Spacecraft"
      encounters = []
      ephemeris = ephemerides.order(:jd).take
      while ephemeris
        encounters << OpenStruct.new(jd: ephemeris.jd, body: ephemeris.central_body)
        ephemeris = ephemerides.order(:jd).
                    where("jd > ? AND central_body_id != ?",
                          ephemeris.jd, ephemeris.central_body_id).take
      end

      encounters
    end
  end

  def inferred_events
    events = []

    if classification == "Spacecraft"
      encounters.each do |encounter|
        description = "Entered orbit around #{ encounter.body.name }"
        events << OpenStruct.new(jd: encounter.jd, description: description)
      end
    else
      Body.spacecraft.joins(:ephemerides).where(ephemerides: { central_body_id: id }).uniq.each do |satellite|
        encounters = satellite.encounters
        encounters.each_with_index do |encounter, i|
          if encounter.body == self
            description = "#{satellite.name} entered orbit"
            events << OpenStruct.new(jd: encounter.jd, description: description)

            if encounters[i+1]
              description = "#{satellite.name} left orbit"
              events << OpenStruct.new(jd: encounters[i+1].jd, description: description)
            end
          end
        end
      end
    end

    events.sort_by(&:jd)
  end
end
