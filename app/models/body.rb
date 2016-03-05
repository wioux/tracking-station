class Body < ActiveRecord::Base
  has_many :ephemerides, foreign_key: :satellite_id


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

  def marked_up_info
    Markdown.render(info) if info
  end

  def ephemeris
    ephemerides.take
  end
end
