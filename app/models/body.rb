class Body < ActiveRecord::Base
  has_many :ephemerides, foreign_key: :satellite_id

  def ephemeris
    ephemerides.take
  end
end
