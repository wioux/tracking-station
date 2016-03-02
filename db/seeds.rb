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

['Pluto', 'Aris', 'Ceres'].each do |name|
  bodies[name] = Body.create!(name: name, classification: 'Minor Planet')
end

['Luna', 'Deimos', 'Phobos', 'Callisto', 'Europa', 'Ganymede',
 'Io', 'Dione', 'Enceladus', 'Hyperion', 'Iapetus', 'Mimas',
 'Phoebe', 'Rhea', 'Tethys', 'Titan', 'Ariel', 'Miranda', 'Oberon',
 'Puck', 'Titania', 'Umbriel', 'Proteus', 'Triton', 'Charon', 'Eris'].each do |name|
  bodies[name] = Body.create!(name: name, classification: 'Moon')
end

['Juno'].each do |name|
  bodies[name] = Body.create!(name: name, classification: 'Spacecraft')
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
bodies['Juno'].update_column(:parent_id, bodies['Sun'].id)

bodies['Earth'].update_column(:obliquity_deg, 23.44);
bodies['Saturn'].update_column(:obliquity_deg, 26.73);

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
bodies['Eris'].update_column(:radius_km, 0.001)
bodies['Juno'].update_column(:radius_km, 0.001)

bodies['Saturn'].tap do |saturn|
  saturn.update_column(:inner_ring_radius_km, saturn.radius_km + 7000);
  saturn.update_column(:outer_ring_radius_km, saturn.radius_km + 80000);
end


bodies['Sun'].update_column(:color, '0xffffff')
bodies['Mercury'].update_column(:color, '0x00ff00')
bodies['Venus'].update_column(:color, '0xffff00')
bodies['Earth'].update_column(:color, '0x0000ff')
bodies['Mars'].update_column(:color, '0xff0000')
bodies['Jupiter'].update_column(:color, '0xa52a2a')
bodies['Saturn'].update_column(:color, '0xffa500')
bodies['Uranus'].update_column(:color, '0x00ffff')
bodies['Neptune'].update_column(:color, '0x0000ff')
bodies['Pluto'].update_column(:color, '0xb22222')

bodies['Juno'].update_column(:color, '0xffc0cb')


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


bodies['Ariel'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.0008951694259745615,
  "qr": 0.001275186624728601,
  "inc": 97.71559792143111,
  "om": 167.6516316707496,
  "w": 106.2868986826513,
  "tp": 2455778.59396737,
  "n": 142.8251350172898,
  "ma": 129.4042327419958,
  "ta": 129.4834377744902,
  "a": 0.001276329155566144,
  "ad": 0.001277471686403687,
  "pr": 2.520564744828842,
  "central_body_id": bodies["Uranus"].id
})
bodies['Callisto'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.007444511287285808,
  "qr": 0.01249150521344517,
  "inc": 1.985107903939454,
  "om": 337.3438001433009,
  "w": 23.83452277269758,
  "tp": 2455780.393634697,
  "n": 21.56907708452574,
  "ma": 340.7251243315799,
  "ta": 340.4410293515363,
  "a": 0.01258519584597322,
  "ad": 0.01267888647850127,
  "pr": 16.69056114868605,
  "central_body_id": bodies["Jupiter"].id
})
bodies['Ceres'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.07862557543382989,
  "qr": 2.548868109995993,
  "inc": 10.58597305702701,
  "om": 80.38122744749634,
  "w": 72.46248719268166,
  "tp": 2456550.703614653,
  "n": 0.2142087751119744,
  "ma": 194.801418343256,
  "ta": 192.7004798690991,
  "a": 2.766376016130609,
  "ad": 2.983883922265223,
  "pr": 1680.603419779677,
  "central_body_id": bodies["Sun"].id
})
bodies['Charon'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.003314894879077369,
  "qr": 0.000115967933429509,
  "inc": 112.8968185166535,
  "om": 227.401557762488,
  "w": 130.8888639805743,
  "tp": 2455776.371097938,
  "n": 56.72842860554361,
  "ma": 177.4976972490934,
  "ta": 177.5142133343694,
  "a": 0.0001163536334933381,
  "ad": 0.0001167393335571673,
  "pr": 6.346024539181755,
  "central_body_id": bodies["Pluto"].id
})
bodies['Deimos'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.0003071263959570378,
  "qr": 0.0001567653700533899,
  "inc": 26.68469234776179,
  "om": 79.17410455665139,
  "w": 281.0104787457933,
  "tp": 2455779.435779717,
  "n": 285.1272628627081,
  "ma": 18.31095349528123,
  "ta": 18.32201459386717,
  "a": 0.0001568135316281962,
  "ad": 0.0001568616932030025,
  "pr": 1.262594100562541,
  "central_body_id": bodies["Mars"].id
})
bodies['Dione'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.00212614493802205,
  "qr": 0.002514508784822323,
  "inc": 28.0364678260015,
  "om": 169.4578887990011,
  "w": 156.3337318838599,
  "tp": 2455779.156087801,
  "n": 131.7445760099957,
  "ma": 45.30856686414313,
  "ta": 45.48209448946213,
  "a": 0.002519866385983374,
  "ad": 0.002525223987144424,
  "pr": 2.732560314078403,
  "central_body_id": bodies["Saturn"].id
})
bodies['Earth'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.01683956431093187,
  "qr": 0.9832687491886603,
  "inc": 0.002967598256203563,
  "om": 156.5979472202093,
  "w": 305.0979675580232,
  "tp": 2455929.301398075,
  "n": 0.9854462962516151,
  "ma": 212.3787670938293,
  "ta": 211.3635154384378,
  "a": 1.000110168692372,
  "ad": 1.016951588196084,
  "pr": 365.3167111889787,
  "central_body_id": bodies["Sun"].id
})
bodies['Enceladus'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.00385749485171748,
  "qr": 0.001588613213859106,
  "inc": 28.05716576333413,
  "om": 169.5276637691992,
  "w": 150.3526274573016,
  "tp": 2455779.002334592,
  "n": 261.6707006416012,
  "ma": 130.2244558643026,
  "ta": 130.5609099108865,
  "a": 0.001594765011681366,
  "ad": 0.001600916809503625,
  "pr": 1.375774968757683,
  "central_body_id": bodies["Saturn"].id
})
bodies['Eris'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.4338439807014026,
  "qr": 38.53912208235697,
  "inc": 43.81897811959627,
  "om": 36.0641475090325,
  "w": 150.9702672691524,
  "tp": 2546067.473849006,
  "n": 0.001754912799774141,
  "ma": 201.5524790267076,
  "ta": 189.511461416042,
  "a": 68.0715576072167,
  "ad": 97.60399313207643,
  "pr": 205138.3977861078,
  "central_body_id": bodies["Sun"].id
})
bodies['Europa'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.009914676230994499,
  "qr": 0.004441841405859979,
  "inc": 2.446869357335124,
  "om": 348.3816680398149,
  "w": 346.8566171689511,
  "tp": 2455779.215812014,
  "n": 101.3459356848002,
  "ma": 28.80129730562597,
  "ta": 29.35465705000679,
  "a": 0.004486321834315255,
  "ad": 0.004530802262770531,
  "pr": 3.552189809758621,
  "central_body_id": bodies["Jupiter"].id
})
bodies['Ganymede'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.00103368519631144,
  "qr": 0.007149840728689256,
  "inc": 2.273018111162647,
  "om": 341.3268128590441,
  "w": 295.1152559052959,
  "tp": 2455781.618102171,
  "n": 50.29088971715775,
  "ma": 253.4787573034961,
  "ta": 253.365237840499,
  "a": 0.007157239060752818,
  "ad": 0.00716463739281638,
  "pr": 7.158354167617336,
  "central_body_id": bodies["Jupiter"].id
})
bodies['Hyperion'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.07617514356903177,
  "qr": 0.009128913356253937,
  "inc": 27.06489696379359,
  "om": 168.7536645796758,
  "w": 336.1726504507164,
  "tp": 2455784.464546395,
  "n": 16.96508735084537,
  "ma": 275.7760367486962,
  "ta": 267.0413227233777,
  "a": 0.009881649419481801,
  "ad": 0.01063438548270967,
  "pr": 21.22004989158286,
  "central_body_id": bodies["Saturn"].id
})
bodies['Iapetus'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.02883796517093491,
  "qr": 0.02311707550901998,
  "inc": 17.14125401884611,
  "om": 139.2979258758107,
  "w": 230.7295510742927,
  "tp": 2455783.199031829,
  "n": 4.537706554928041,
  "ma": 343.2148790203444,
  "ta": 342.226558064334,
  "a": 0.02380352060723712,
  "ad": 0.02448996570545425,
  "pr": 79.33523149685224,
  "central_body_id": bodies["Saturn"].id
})
bodies['Io'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.004360034301270774,
  "qr": 0.002808492265199406,
  "inc": 2.226527761356999,
  "om": 338.9901695899824,
  "w": 183.3002735658015,
  "tp": 2455779.254643133,
  "n": 203.2691320422335,
  "ma": 49.87347741697086,
  "ta": 50.25684433482327,
  "a": 0.00282079101076305,
  "ad": 0.002833089756326693,
  "pr": 1.771051002102977,
  "central_body_id": bodies["Jupiter"].id
})
bodies['Juno'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.4173665087470217,
  "qr": 1.009159534962502,
  "inc": 0.07518758599087452,
  "om": 133.0480668303969,
  "w": 190.6114160558619,
  "tp": 2455788.63670028,
  "n": 0.4323719385776768,
  "ma": 356.0495471880179,
  "ta": 349.4597591402473,
  "a": 1.732065784258746,
  "ad": 2.45497203355499,
  "pr": 832.616476416693,
  "central_body_id": bodies["Sun"].id
})
bodies['Jupiter'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.04891892260203157,
  "qr": 4.948385803889853,
  "inc": 1.303834397441361,
  "om": 100.5120910778531,
  "w": 273.9573049396543,
  "tp": 2455638.145845324,
  "n": 0.08308876208241964,
  "ma": 11.74494172725454,
  "ta": 12.95838321132521,
  "a": 5.202906378316328,
  "ad": 5.457426952742802,
  "pr": 4332.715892949508,
  "central_body_id": bodies["Sun"].id
})
bodies['Luna'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.03840460489979151,
  "qr": 0.00244540779119874,
  "inc": 5.12815443412296,
  "om": 261.9810327717914,
  "w": 267.6335564179775,
  "tp": 2455776.212655336,
  "n": 13.40088229337939,
  "ma": 44.05331890425668,
  "ta": 47.22090943703836,
  "a": 0.002543073525163774,
  "ad": 0.002640739259128808,
  "pr": 26.86390284749054,
  "central_body_id": bodies["Earth"].id
})
bodies['Mars'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.09346863158508391,
  "qr": 1.381269779836576,
  "inc": 1.848843364732058,
  "om": 49.52487562397599,
  "w": 286.5925134501285,
  "tp": 2455630.009842575,
  "n": 0.5240354092010466,
  "ma": 78.33813581782258,
  "ta": 89.01885939435087,
  "a": 1.523686689685926,
  "ad": 1.666103599535276,
  "pr": 686.9764784575573,
  "central_body_id": bodies["Sun"].id
})
bodies['Mercury'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.2056275533900972,
  "qr": 0.3075007038269294,
  "inc": 7.004335086918402,
  "om": 48.31609491542321,
  "w": 29.15509948226071,
  "tp": 2455812.784529509,
  "n": 4.092335175361661,
  "ma": 223.7885490920289,
  "ta": 210.171883808099,
  "a": 0.3870989044738804,
  "ad": 0.4666971051208314,
  "pr": 87.96933402899604,
  "central_body_id": bodies["Sun"].id
})
bodies['Mimas'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.01898228010735327,
  "qr": 0.001215596519140236,
  "inc": 26.88009575171515,
  "om": 167.2651384880751,
  "w": 27.72686225865852,
  "tp": 2455779.094426223,
  "n": 382.0597900936946,
  "ma": 154.9534323154385,
  "ta": 155.8548851696193,
  "a": 0.001239117800311762,
  "ad": 0.001262639081483287,
  "pr": 0.9422608956355111,
  "central_body_id": bodies["Saturn"].id
})
bodies['Miranda'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.001452701749448823,
  "qr": 0.0008669342355844092,
  "inc": 94.38454465370948,
  "om": 164.7516523422943,
  "w": 127.5097022644528,
  "tp": 2455779.021088674,
  "n": 254.5841178609539,
  "ma": 121.9232173636087,
  "ta": 122.0643720944501,
  "a": 0.0008681954646547767,
  "ad": 0.0008694566937251442,
  "pr": 1.414070928794628,
  "central_body_id": bodies["Uranus"].id
})
bodies['Neptune'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.01152152777725301,
  "qr": 29.82976621984582,
  "inc": 1.768402463190875,
  "om": 131.7699925749968,
  "w": 258.7298984904464,
  "tp": 2465886.495945542,
  "n": 0.00594554003937569,
  "ma": 299.9084509279754,
  "ta": 298.7558129404413,
  "a": 30.17745662459291,
  "ad": 30.52514702934,
  "pr": 60549.58802998856,
  "central_body_id": bodies["Sun"].id
})
bodies['Oberon'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.00197699829496967,
  "qr": 0.003892542571254287,
  "inc": 97.90475761926955,
  "om": 167.7386210912263,
  "w": 201.6388886582014,
  "tp": 2455780.464224621,
  "n": 26.73595784212888,
  "ma": 334.220531193045,
  "ta": 334.1217841767947,
  "a": 0.003900253365507846,
  "ad": 0.003907964159761405,
  "pr": 13.46501225524579,
  "central_body_id": bodies["Uranus"].id
})
bodies['Phobos'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.01471913427942003,
  "qr": 6.177131339929747e-05,
  "inc": 26.86409725620145,
  "om": 85.22279864293938,
  "w": 25.75786514132789,
  "tp": 2455779.358333858,
  "n": 1127.90850554097,
  "ma": 159.7864465873923,
  "ta": 160.3593240211518,
  "a": 6.269411651886829e-05,
  "ad": 6.361691963843911e-05,
  "pr": 0.3191748251134396,
  "central_body_id": bodies["Mars"].id
})
bodies['Phoebe'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.1672939428146539,
  "qr": 0.07201152958428951,
  "inc": 173.00760009255,
  "om": 267.362882203559,
  "w": 2.538436018836846,
  "tp": 2455865.879281071,
  "n": 0.6552918882001004,
  "ma": 303.3963578053373,
  "ta": 285.615377712825,
  "a": 0.08647893090594029,
  "ad": 0.1009463322275911,
  "pr": 549.3735028352284,
  "central_body_id": bodies["Saturn"].id
})
bodies['Pluto'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.2475044314769637,
  "qr": 29.68716174422574,
  "inc": 17.14468716415136,
  "om": 110.3043092572889,
  "w": 114.0083725293301,
  "tp": 2447827.702970389,
  "n": 0.003977470594420682,
  "ma": 31.62803885808113,
  "ta": 51.31213051529651,
  "a": 39.45161006395604,
  "ad": 49.21605838368633,
  "pr": 90509.78290197364,
  "central_body_id": bodies["Sun"].id
})
bodies['Proteus'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.0006297034831835774,
  "qr": 0.0007852332888827999,
  "inc": 29.08276494164935,
  "om": 48.50231278891294,
  "w": 355.3523669445825,
  "tp": 2455779.821058841,
  "n": 321.1867555330047,
  "ma": 256.8801523195471,
  "ta": 256.8098897173018,
  "a": 0.0007857280645819022,
  "ad": 0.0007862228402810044,
  "pr": 1.120843228428225,
  "central_body_id": bodies["Neptune"].id
})
bodies['Puck'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.0006702011797882727,
  "qr": 0.0005749363492331224,
  "inc": 98.07393269323374,
  "om": 167.6011818123003,
  "w": 13.1405399037007,
  "tp": 2455779.504715275,
  "n": 471.945302707609,
  "ma": 357.7746480795853,
  "ta": 357.7716634641228,
  "a": 0.0005753219306698154,
  "ad": 0.0005757075121065082,
  "pr": 0.7628002608239454,
  "central_body_id": bodies["Uranus"].id
})
bodies['Rhea'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.0008344699851320741,
  "qr": 0.003516294415904008,
  "inc": 27.7031139540304,
  "om": 169.32288614342,
  "w": 226.9952266291568,
  "tp": 2455780.591057124,
  "n": 79.82261371824248,
  "ma": 272.908968664872,
  "ta": 272.8134636545424,
  "a": 0.003519231108634908,
  "ad": 0.003522167801365808,
  "pr": 4.51000015197105,
  "central_body_id": bodies["Saturn"].id
})
bodies['Saturn'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.05493030378415843,
  "qr": 8.995946543240741,
  "inc": 2.48767223494948,
  "om": 113.614544226561,
  "w": 336.6747186352276,
  "tp": 2452757.960443441,
  "n": 0.03356538258655242,
  "ma": 101.4191312162921,
  "ta": 107.4949002188788,
  "a": 9.518818113903613,
  "ad": 10.04168968456649,
  "pr": 10725.3358150081,
  "central_body_id": bodies["Sun"].id
})
bodies['Tethys'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.0006519901272437905,
  "qr": 0.001965675705980838,
  "inc": 27.84003853435382,
  "om": 171.8117351546491,
  "w": 20.69447311727054,
  "tp": 2455778.679401086,
  "n": 191.0323351363022,
  "ma": 156.7609266883316,
  "ta": 156.7903838613755,
  "a": 0.001966958143270952,
  "ad": 0.001968240580561066,
  "pr": 1.884497719944316,
  "central_body_id": bodies["Saturn"].id
})
bodies['Titan'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.02876871660140774,
  "qr": 0.007931118560917346,
  "inc": 27.72259276775693,
  "om": 169.1508978296759,
  "w": 170.5388927082882,
  "tp": 2455779.51870802,
  "n": 22.57503471443182,
  "ma": 359.5776658019009,
  "ta": 359.5524610039671,
  "a": 0.008166045201060955,
  "ad": 0.008400971841204563,
  "pr": 15.94681933179302,
  "central_body_id": bodies["Saturn"].id
})
bodies['Titania'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.001039472037466248,
  "qr": 0.002913277791875941,
  "inc": 97.79946784651543,
  "om": 167.6172921974529,
  "w": 228.9750544041831,
  "tp": 2455783.6083335,
  "n": 41.35063588902694,
  "ma": 190.117797338254,
  "ta": 190.0968988879968,
  "a": 0.002916309213756246,
  "ad": 0.002919340635636552,
  "pr": 8.70603298498565,
  "central_body_id": bodies["Uranus"].id
})
bodies['Triton'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 1.128868530649856e-05,
  "qr": 0.002370934620899851,
  "inc": 129.6623601200764,
  "om": 218.8587173851436,
  "w": 274.1660211665499,
  "tp": 2455779.552718846,
  "n": 61.25524164130429,
  "ma": 356.7706943807248,
  "ta": 356.7706215090637,
  "a": 0.002370961385936812,
  "ad": 0.002370988150973772,
  "pr": 5.87704807546221,
  "central_body_id": bodies["Neptune"].id
})
bodies['Umbriel'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.003943043660011076,
  "qr": 0.001770707124061592,
  "inc": 97.69002347654326,
  "om": 167.6749582124471,
  "w": 8.038665628504688,
  "tp": 2455777.608028413,
  "n": 86.88697004096372,
  "ma": 164.3876785596944,
  "ta": 164.5087060374493,
  "a": 0.001777716738777725,
  "ad": 0.001784726353493858,
  "pr": 4.143314007040117,
  "central_body_id": bodies["Uranus"].id
})
bodies['Uranus'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.04348786961617185,
  "qr": 18.42894410532503,
  "inc": 0.7720797792846955,
  "om": 73.99570416008443,
  "w": 95.14016739460088,
  "tp": 2470035.206778334,
  "n": 0.01165463290411101,
  "ma": 193.8549707098709,
  "ta": 192.7216434027725,
  "a": 19.26681692779985,
  "ad": 20.10468975027467,
  "pr": 30889.00379462103,
  "central_body_id": bodies["Sun"].id
})
bodies['Venus'].ephemerides.create!({
  "jd": 2455779.5,
  "ec": 0.006726209189139463,
  "qr": 0.7184610137964366,
  "inc": 3.39463254742626,
  "om": 76.64583431703088,
  "w": 54.95217790394066,
  "tp": 2455782.868554816,
  "n": 1.602150314347918,
  "ma": 354.6030688433027,
  "ta": 354.5299626728137,
  "a": 0.7233262575164898,
  "ad": 0.7281915012365431,
  "pr": 224.6980178926105,
  "central_body_id": bodies["Sun"].id
})
