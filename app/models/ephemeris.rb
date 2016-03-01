class Ephemeris < ActiveRecord::Base
  belongs_to :satellite, class_name: 'Body'
  belongs_to :central_body, class_name: 'Body'
end
