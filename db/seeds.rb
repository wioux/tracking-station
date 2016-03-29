# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

bodies = {}

bodies['Sun'] = Body.create!(name: 'Sun', classification: 'Star')

['Mercury', 'Venus', 'Earth', 'Mars',
 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].each do |name|
  bodies[name] = Body.create!(name: name, classification: 'Planet')
end

['Pluto', 'Eris', 'Ceres'].each do |name|
  bodies[name] = Body.create!(name: name, classification: 'Minor Planet')
end

['Luna', 'Deimos', 'Phobos', 'Callisto', 'Europa', 'Ganymede',
 'Io', 'Dione', 'Enceladus', 'Hyperion', 'Iapetus', 'Mimas',
 'Phoebe', 'Rhea', 'Tethys', 'Titan', 'Ariel', 'Miranda', 'Oberon',
 'Puck', 'Titania', 'Umbriel', 'Proteus', 'Triton', 'Charon'].each do |name|
  bodies[name] = Body.create!(name: name, classification: 'Moon')
end

bodies['Mercury'].update_column(:parent_id, bodies['Sun'].id)
bodies['Venus'].update_column(:parent_id, bodies['Sun'].id)
bodies['Earth'].update_column(:parent_id, bodies['Sun'].id)
bodies['Luna'].update_column(:parent_id, bodies['Earth'].id)
bodies['Mars'].update_column(:parent_id, bodies['Sun'].id)
bodies['Phobos'].update_column(:parent_id, bodies['Mars'].id)
bodies['Deimos'].update_column(:parent_id, bodies['Mars'].id)
bodies['Jupiter'].update_column(:parent_id, bodies['Sun'].id)
bodies['Callisto'].update_column(:parent_id, bodies['Jupiter'].id)
bodies['Europa'].update_column(:parent_id, bodies['Jupiter'].id)
bodies['Ganymede'].update_column(:parent_id, bodies['Jupiter'].id)
bodies['Io'].update_column(:parent_id, bodies['Jupiter'].id)
bodies['Saturn'].update_column(:parent_id, bodies['Sun'].id)
bodies['Phoebe'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Dione'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Enceladus'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Hyperion'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Iapetus'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Mimas'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Rhea'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Tethys'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Titan'].update_column(:parent_id, bodies['Saturn'].id)
bodies['Uranus'].update_column(:parent_id, bodies['Sun'].id)
bodies['Oberon'].update_column(:parent_id, bodies['Uranus'].id)
bodies['Ariel'].update_column(:parent_id, bodies['Uranus'].id)
bodies['Miranda'].update_column(:parent_id, bodies['Uranus'].id)
bodies['Puck'].update_column(:parent_id, bodies['Uranus'].id)
bodies['Titania'].update_column(:parent_id, bodies['Uranus'].id)
bodies['Umbriel'].update_column(:parent_id, bodies['Uranus'].id)
bodies['Neptune'].update_column(:parent_id, bodies['Sun'].id)
bodies['Proteus'].update_column(:parent_id, bodies['Neptune'].id)
bodies['Triton'].update_column(:parent_id, bodies['Neptune'].id)
bodies['Pluto'].update_column(:parent_id, bodies['Sun'].id)
bodies['Charon'].update_column(:parent_id, bodies['Pluto'].id)
bodies['Ceres'].update_column(:parent_id, bodies['Sun'].id)
bodies['Eris'].update_column(:parent_id, bodies['Sun'].id)

bodies['Sun']      .update_column(:horizons_id, '@Sun'   )
bodies['Mercury']  .update_column(:horizons_id, '199'   )
bodies['Venus']    .update_column(:horizons_id, '299'   )
bodies['Earth']    .update_column(:horizons_id, '399'   )
bodies['Luna']     .update_column(:horizons_id, '301'   )
bodies['Mars']     .update_column(:horizons_id, '499'   )
bodies['Phobos']   .update_column(:horizons_id, '401'   )
bodies['Deimos']   .update_column(:horizons_id, '402'   )
bodies['Jupiter']  .update_column(:horizons_id, '5'     )
bodies['Callisto'] .update_column(:horizons_id, '504'   )
bodies['Europa']   .update_column(:horizons_id, '502'   )
bodies['Ganymede'] .update_column(:horizons_id, '503'   )
bodies['Io']       .update_column(:horizons_id, '501'   )
bodies['Saturn']   .update_column(:horizons_id, '6'     )
bodies['Phoebe']   .update_column(:horizons_id, '609'   )
bodies['Dione']    .update_column(:horizons_id, '604'   )
bodies['Enceladus'].update_column(:horizons_id, '602'   )
bodies['Hyperion'] .update_column(:horizons_id, '607'   )
bodies['Iapetus']  .update_column(:horizons_id, '608'   )
bodies['Mimas']    .update_column(:horizons_id, '601'   )
bodies['Rhea']     .update_column(:horizons_id, '605'   )
bodies['Tethys']   .update_column(:horizons_id, '603'   )
bodies['Titan']    .update_column(:horizons_id, '606'   )
bodies['Uranus']   .update_column(:horizons_id, '7'     )
bodies['Oberon']   .update_column(:horizons_id, '704'   )
bodies['Ariel']    .update_column(:horizons_id, '701'   )
bodies['Miranda']  .update_column(:horizons_id, '705'   )
bodies['Puck']     .update_column(:horizons_id, '715'   )
bodies['Titania']  .update_column(:horizons_id, '703'   )
bodies['Umbriel']  .update_column(:horizons_id, '702'   )
bodies['Neptune']  .update_column(:horizons_id, '8'     )
bodies['Proteus']  .update_column(:horizons_id, '808'   )
bodies['Triton']   .update_column(:horizons_id, '801'   )
bodies['Pluto']    .update_column(:horizons_id, '9'     )
bodies['Charon']   .update_column(:horizons_id, '901'   )
bodies['Ceres']    .update_column(:horizons_id, 'Ceres' )
bodies['Eris']     .update_column(:horizons_id, '136199')

bodies['Sun'].update_column(:radius_km, 695500)
bodies['Mercury'].update_column(:radius_km, 2440)
bodies['Venus'].update_column(:radius_km, 6051.8)
bodies['Earth'].update_column(:radius_km, 6371.01)
bodies['Luna'].update_column(:radius_km, 1737.53)
bodies['Mars'].update_column(:radius_km, 3389.9)
bodies['Deimos'].update_column(:radius_km, 7.8)
bodies['Phobos'].update_column(:radius_km, 13.1)
bodies['Jupiter'].update_column(:radius_km, 69911)
bodies['Callisto'].update_column(:radius_km, 2403)
bodies['Europa'].update_column(:radius_km, 1565)
bodies['Ganymede'].update_column(:radius_km, 2634)
bodies['Io'].update_column(:radius_km, 1821.3)
bodies['Saturn'].update_column(:radius_km, 58232)
bodies['Dione'].update_column(:radius_km, 562.5)
bodies['Enceladus'].update_column(:radius_km, 252.3)
bodies['Hyperion'].update_column(:radius_km, 133)
bodies['Iapetus'].update_column(:radius_km, 734.5)
bodies['Mimas'].update_column(:radius_km, 198.8)
bodies['Phoebe'].update_column(:radius_km, 106.6)
bodies['Rhea'].update_column(:radius_km, 764.5)
bodies['Tethys'].update_column(:radius_km, 536.3)
bodies['Titan'].update_column(:radius_km, 2575.5)
bodies['Uranus'].update_column(:radius_km, 25362)
bodies['Ariel'].update_column(:radius_km, 581.1)
bodies['Miranda'].update_column(:radius_km, 240)
bodies['Oberon'].update_column(:radius_km, 761.4)
bodies['Puck'].update_column(:radius_km, 77)
bodies['Titania'].update_column(:radius_km, 788.9)
bodies['Umbriel'].update_column(:radius_km, 584.7)
bodies['Neptune'].update_column(:radius_km, 24622)
bodies['Proteus'].update_column(:radius_km, 218)
bodies['Triton'].update_column(:radius_km, 1352.6)
bodies['Pluto'].update_column(:radius_km, 1186)
bodies['Charon'].update_column(:radius_km, 605)
bodies['Ceres'].update_column(:radius_km, 490)

bodies['Saturn'].tap do |saturn|
  saturn.update_column(:inner_ring_radius_km, saturn.radius_km + 7000);
  saturn.update_column(:outer_ring_radius_km, saturn.radius_km + 80000);
end

bodies['Mercury'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 281.010);
  saturn.update_column(:north_pole_declination, 61.416);
end

bodies['Venus'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 272.76);
  saturn.update_column(:north_pole_declination, 67.16);
end

bodies['Earth'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 0.0);
  saturn.update_column(:north_pole_declination, 90.0);
end

bodies['Luna'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 0.0);
  saturn.update_column(:north_pole_declination, 90.0);
end

bodies['Mars'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 317.681);
  saturn.update_column(:north_pole_declination, 52.887);
end

bodies['Jupiter'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 268.05);
  saturn.update_column(:north_pole_declination, 64.49);
end

bodies['Saturn'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 40.5954);
  saturn.update_column(:north_pole_declination, 83.5380);
end

bodies['Uranus'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 257.43);
  saturn.update_column(:north_pole_declination, -15.10);
end

bodies['Neptune'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 299.36);
  saturn.update_column(:north_pole_declination, 43.46);
end

bodies['Pluto'].tap do |saturn|
  saturn.update_column(:north_pole_right_ascension, 132.99);
  saturn.update_column(:north_pole_declination, -6.16);
end

bodies['Sun'].update_column(:color, '0xffffff')
bodies['Mercury'].update_column(:color, '0x00ff00')
bodies['Venus'].update_column(:color, '0xffff00')
bodies['Earth'].update_column(:color, '0x00ccff')
bodies['Mars'].update_column(:color, '0xff0000')
bodies['Jupiter'].update_column(:color, '0xa52a2a')
bodies['Saturn'].update_column(:color, '0xffa500')
bodies['Uranus'].update_column(:color, '0x00ffff')
bodies['Neptune'].update_column(:color, '0x0000ff')
bodies['Pluto'].update_column(:color, '0xb22222')


bodies['Sun'].update_column(:texture, "sunmap.jpg")
bodies['Mercury'].update_column(:texture, "mercurymap.jpg")
bodies['Venus'].update_column(:texture, "venusmap.jpg")
bodies['Earth'].update_column(:texture, "earthmap-stacked-clouds.png")
bodies['Mars'].update_column(:texture, "mars_1k_color.jpg")
bodies['Jupiter'].update_column(:texture, "jupiter2_1k.jpg")
bodies['Saturn'].update_column(:texture, "saturnmap.jpg")
bodies['Uranus'].update_column(:texture, "uranusmap.jpg")
bodies['Neptune'].update_column(:texture, "neptunemap.jpg")
bodies['Pluto'].update_column(:texture, "plutomap1k.jpg")

bodies['Luna'].update_column(:texture, "moonmap1k.jpg")

bodies['Saturn'].update_column(:ring_texture, "saturnringcolor.jpg")



Body.all.find_each do |body|
  unless body.classification == 'Star'
    body.import_horizons_data('1960-01-01', '2030-01-01', '1 month')
  end
end
