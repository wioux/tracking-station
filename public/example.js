var Mercury = new Body('Mercury')
Mercury.radiusKm = 2440.0;
Mercury.spacecraft = false;
Sun.addSatellite(Mercury);
Mercury.ephemerides.splice(-1, 0,
  {
    "a": 0.3870989044738804,
    "b": 0.378826725956137,
    "qr": 0.3075007038269294,
    "ta": 210.171883808099,
    "oa": new THREE.Vector3(0.09107115957765484, -0.08109556395350119, 0.9925369279781207),
    "an": [
      0.6650205908259765,
      0.7468250221956072,
      0.0
    ],
    "n": 4.092335175361661,
    "ma": 223.7885490920289,
    "ec": 0.2056275533900972,
    "mja": new THREE.Vector3(0.21964574726979533, 0.9737691694392325, 0.05940833574440675),
    "mna": new THREE.Vector3(-0.9713196124857536, 0.21259612921379964, 0.10649458316663302),
    "jd": 2455779.5
  }
);


var Venus = new Body('Venus')
Venus.radiusKm = 6051.8;
Venus.spacecraft = false;
Sun.addSatellite(Venus);
Venus.ephemerides.splice(-1, 0,
  {
    "a": 0.7233262575164898,
    "b": 0.7233098950079114,
    "qr": 0.7184610137964366,
    "ta": 354.5299626728137,
    "oa": new THREE.Vector3(0.057611799398014404, -0.013676373075288724, 0.998245379347998),
    "an": [
      0.23096964788416152,
      0.972960955925913,
      0.0
    ],
    "n": 1.602150314347918,
    "ma": 354.6030688433027,
    "ec": 0.006726209189139463,
    "mja": new THREE.Vector3(-0.6625026486076491, 0.747489345035433, 0.04847596978245102),
    "mna": new THREE.Vector3(-0.7468407602414138, -0.6641329956251268, 0.03400357281260945),
    "jd": 2455779.5
  }
);

var Earth = new Body('Earth')
Earth.radiusKm = 6371.01;
Earth.spacecraft = false;
Sun.addSatellite(Earth);
Earth.ephemerides.splice(-1, 0,
  {
    "a": 1.000110168692372,
    "b": 0.9999683575548701,
    "qr": 0.9832687491886603,
    "ta": 211.3635154384378,
    "oa": new THREE.Vector3(2.0571724031428735e-05, 4.753377685509278e-05, 0.9999999986586723),
    "an": [
      -0.9177403961731971,
      0.39718077147800496,
      0.0
    ],
    "n": 0.9854462962516151,
    "ma": 212.3787670938293,
    "ec": 0.01683956431093187,
    "mja": new THREE.Vector3(-0.20271747613192811, 0.979237265975374, -4.2376597770571705e-05),
    "mna": new THREE.Vector3(-0.9792372666762157, -0.20271747498825785, 2.978052607201884e-05),
    "jd": 2455779.5
  }
);

var Moon = new Body('Moon')
Moon.radiusKm = 1737.53;
Moon.spacecraft = false;
Earth.addSatellite(Moon);
Moon.ephemerides.splice(-1, 0,
  {
    "a": 0.002543073525163774,
    "b": 0.0025411974261749077,
    "qr": 0.00244540779119874,
    "ta": 47.22090943703836,
    "oa": new THREE.Vector3(-0.08850972908595944, 0.0124691116402879, 0.9959972636066989),
    "an": [
      -0.13950091224626454,
      -0.9902219425373586,
      0.0
    ],
    "n": 13.40088229337939,
    "ma": 44.05331890425668,
    "ec": 0.03840460489979151,
    "mja": new THREE.Vector3(-0.97965718722067, 0.17971078401260165, -0.0893075004490736),
    "mna": new THREE.Vector3(-0.18010503431058053, -0.9836404604145144, -0.003690697970115786),
    "jd": 2455779.5
  }
);

var Mars = new Body('Mars')
Mars.radiusKm = 3389.9;
Mars.spacecraft = false;
Sun.addSatellite(Mars);
Mars.ephemerides.splice(-1, 0,
  {
    "a": 1.523686689685926,
    "b": 1.5170163321846661,
    "qr": 1.381269779836576,
    "ta": 89.01885939435087,
    "oa": new THREE.Vector3(0.02454192365000344, -0.020942362196899756, 0.9994794202229337),
    "an": [
      0.649117848104826,
      0.7606878592903663,
      0.0
    ],
    "n": 0.5240354092010466,
    "ma": 78.33813581782258,
    "ec": 0.09346863158508391,
    "mja": new THREE.Vector3(0.9139973629308391, -0.40454024846155207, -0.030919377906716485),
    "mna": new THREE.Vector3(0.4049771778002187, 0.9142803753992973, 0.009213067930412041),
    "jd": 2455779.5
  }
);

var Jupiter = new Body('Jupiter')
Jupiter.radiusKm = 0.001;
Jupiter.spacecraft = false;
Sun.addSatellite(Jupiter);
Jupiter.ephemerides.splice(-1, 0,
  {
    "a": 5.202906378316328,
    "b": 5.196677213250632,
    "qr": 4.948385803889853,
    "ta": 12.95838321132521,
    "oa": new THREE.Vector3(0.022372341760797783, 0.004151352037876917, 0.9997410887826886),
    "an": [
      -0.18244301684938677,
      0.9832164286681211,
      0.0
    ],
    "n": 0.08308876208241964,
    "ma": 11.74494172725454,
    "ec": 0.04891892260203157,
    "mja": new THREE.Vector3(0.9680272814878741, 0.24981571781046, -0.022699987445831408),
    "mna": new THREE.Vector3(-0.24984527335800097, 0.9682845002431375, 0.0015703405883494854),
    "jd": 2455779.5
  }
);

var Saturn = new Body('Saturn')
Saturn.radiusKm = 0.001;
Saturn.spacecraft = false;
Sun.addSatellite(Saturn);
Saturn.ephemerides.splice(-1, 0,
  {
    "a": 9.518818113903613,
    "b": 9.504446517613326,
    "qr": 8.995946543240741,
    "ta": 107.4949002188788,
    "oa": new THREE.Vector3(0.039769790594452674, 0.017387017888839066, 0.9990575836081754),
    "an": [
      -0.40058163342351794,
      0.9162610735831498,
      0.0
    ],
    "n": 0.03356538258655242,
    "ma": 101.4191312162921,
    "ec": 0.05493030378415843,
    "mja": new THREE.Vector3(-0.005390471128099956, 0.9998377786827661, -0.017186015818942323),
    "mna": new THREE.Vector3(-0.9991943287354518, -0.00470190680947662, 0.03985706330456986),
    "jd": 2455779.5
  }
);

var Uranus = new Body('Uranus')
Uranus.radiusKm = 0.001;
Uranus.spacecraft = false;
Sun.addSatellite(Uranus);
Uranus.ephemerides.splice(-1, 0,
  {
    "a": 19.26681692779985,
    "b": 19.248589653860694,
    "qr": 18.42894410532503,
    "ta": 192.7216434027725,
    "oa": new THREE.Vector3(0.012952652110642598, -0.003715164244229649, 0.9999092090574718),
    "an": [
      0.27570942712843444,
      0.9612410268983064,
      0.0
    ],
    "n": 0.01165463290411101,
    "ma": 193.8549707098709,
    "ec": 0.04348786961617185,
    "mja": new THREE.Vector3(-0.9819899874818032, 0.18845569321029126, 0.013420737018385781),
    "mna": new THREE.Vector3(-0.18848844338258205, -0.9820746658229541, -0.0012072530572610225),
    "jd": 2455779.5
  }
);

var Neptune = new Body('Neptune')
Neptune.radiusKm = 0.001;
Neptune.spacecraft = false;
Sun.addSatellite(Neptune);
Neptune.ephemerides.splice(-1, 0,
  {
    "a": 30.17745662459291,
    "b": 30.1754535957893,
    "qr": 29.82976621984582,
    "ta": 298.7558129404413,
    "oa": new THREE.Vector3(0.02301581981144247, 0.020556837807919903, 0.9995237308127037),
    "an": [
      -0.6661419519277723,
      0.7458249793898415,
      0.0
    ],
    "n": 0.00594554003937569,
    "ma": 299.9084509279754,
    "ec": 0.01152152777725301,
    "mja": new THREE.Vector3(0.8612817616099475, 0.5072255797385045, -0.030264473843170114),
    "mna": new THREE.Vector3(-0.5076061457040025, 0.8615681213219749, -0.006031016933319363),
    "jd": 2455779.5
  }
);

var Pluto = new Body('Pluto')
Pluto.radiusKm = 0.001;
Pluto.spacecraft = false;
Sun.addSatellite(Pluto);
Pluto.ephemerides.splice(-1, 0,
  {
    "a": 39.45161006395604,
    "b": 38.22414270653763,
    "qr": 29.68716174422574,
    "ta": 51.31213051529651,
    "oa": new THREE.Vector3(0.2764685488616011, 0.10229246091407398, 0.9555633908488244),
    "an": [
      -0.3470061899015038,
      0.9378628386763395,
      0.0
    ],
    "n": 0.003977470594420682,
    "ma": 31.62803885808113,
    "ec": 0.2475044314769637,
    "mja": new THREE.Vector3(-0.677468194169651, -0.6844879270763836, 0.2692826091213224),
    "mna": new THREE.Vector3(0.6816171853605746, -0.7218119769904193, -0.1199394951394658),
    "jd": 2455779.5
  }
);

var Oberon = new Body('Oberon')
Oberon.radiusKm = 761.4;
Oberon.spacecraft = false;
Uranus.addSatellite(Oberon);
Oberon.ephemerides.splice(-1, 0,
  {
    "a": 0.003900253365507846,
    "b": 0.003900245743386852,
    "qr": 0.003892542571254287,
    "ta": 334.1217841767947,
    "oa": new THREE.Vector3(0.21035379915263114, 0.9679037453263748, -0.1375267936266647),
    "an": [
      -0.9771889488277672,
      0.21237174550510093,
      0.0
    ],
    "n": 26.73595784212888,
    "ma": 334.220531193045,
    "ec": 0.00197699829496967,
    "mja": new THREE.Vector3(0.897552766888, -0.24696207943991139, -0.36525164198181287),
    "mna": new THREE.Vector3(-0.38749233519354953, -0.046605483603236825, -0.920694096355765),
    "jd": 2455779.5
  }
);

var Phobos = new Body('Phobos')
Phobos.radiusKm = 13.1;
Phobos.spacecraft = false;
Mars.addSatellite(Phobos);
Phobos.ephemerides.splice(-1, 0,
  {
    "a": 6.269411651886829e-05,
    "b": 6.268732471946737e-05,
    "qr": 6.177131339929747e-05,
    "ta": 160.3593240211518,
    "oa": new THREE.Vector3(0.4503060195199642, -0.0376328136062387, 0.8920808596333427),
    "an": [
      0.08328132086522949,
      0.9965260767260146,
      0.0
    ],
    "n": 1127.90850554097,
    "ma": 159.7864465873923,
    "ec": 0.01471913427942003,
    "mja": new THREE.Vector3(-0.311317483408979, 0.9297955630744635, 0.1963711674634066),
    "mna": new THREE.Vector3(-0.8368428247335252, -0.3661474869873057, 0.4069767861498921),
    "jd": 2455779.5
  }
);

var Phoebe = new Body('Phoebe')
Phoebe.radiusKm = 106.6;
Phoebe.spacecraft = false;
Saturn.addSatellite(Phoebe);
Phoebe.ephemerides.splice(-1, 0,
  {
    "a": 0.08647893090594029,
    "b": 0.08526018877314717,
    "qr": 0.07201152958428951,
    "ta": 285.615377712825,
    "oa": new THREE.Vector3(-0.12160876089957999, 0.005601167834243511, -0.9925623084680184),
    "an": [
      -0.046010139430514414,
      -0.9989409727654506,
      0.0
    ],
    "n": 0.6552918882001004,
    "ma": 303.3963578053373,
    "ec": 0.1672939428146539,
    "mja": new THREE.Vector3(-0.08987859820331741, -0.995938134145986, 0.005391710194276519),
    "mna": new THREE.Vector3(-0.988500453645559, 0.08986578811040975, 0.12161822753937634),
    "jd": 2455779.5
  }
);

var Ariel = new Body('Ariel')
Ariel.radiusKm = 581.1;
Ariel.spacecraft = false;
Uranus.addSatellite(Ariel);
Ariel.ephemerides.splice(-1, 0,
  {
    "a": 0.001276329155566144,
    "b": 0.0012763286441867046,
    "qr": 0.001275186624728601,
    "ta": 129.4834377744902,
    "oa": new THREE.Vector3(0.2119190217741671, 0.9680215210353503, -0.13425596084601565),
    "an": [
      -0.9768653889130885,
      0.21385511904951043,
      0.0
    ],
    "n": 142.8251350172898,
    "ma": 129.4042327419958,
    "ec": 0.0008951694259745615,
    "mja": new THREE.Vector3(0.30151831688619435, 0.06591180292443752, 0.9511794461705776),
    "mna": new THREE.Vector3(0.9296112266923184, -0.2420536491103923, -0.2779082549330741),
    "jd": 2455779.5
  }
);

var Callisto = new Body('Callisto')
Callisto.radiusKm = 2403.0;
Callisto.spacecraft = false;
Jupiter.addSatellite(Callisto);
Callisto.ephemerides.splice(-1, 0,
  {
    "a": 0.01258519584597322,
    "b": 0.012584847100655537,
    "qr": 0.01249150521344517,
    "ta": 340.4410293515363,
    "oa": new THREE.Vector3(-0.013343250855531796, -0.031966687161968335, 0.99939986420276),
    "an": [
      0.922832828329447,
      -0.38520068919651906,
      0.0
    ],
    "n": 21.56907708452574,
    "ma": 340.7251243315799,
    "ec": 0.007444511287285808,
    "mja": new THREE.Vector3(0.9996951191101028, 0.020340366120037638, 0.013997797453190151),
    "mna": new THREE.Vector3(-0.020775622350342474, 0.9992819424056415, 0.03168553452230631),
    "jd": 2455779.5
  }
);

var Ceres = new Body('Ceres')
Ceres.radiusKm = 0.001;
Ceres.spacecraft = false;
Sun.addSatellite(Ceres);
Ceres.ephemerides.splice(-1, 0,
  {
    "a": 2.766376016130609,
    "b": 2.757811917696998,
    "qr": 2.548868109995993,
    "ta": 192.7004798690991,
    "oa": new THREE.Vector3(0.18112798076257142, -0.03069655121061047, 0.982980353989157),
    "an": [
      0.16709179231088747,
      0.9859413435607289,
      0.0
    ],
    "n": 0.2142087751119744,
    "ma": 194.801418343256,
    "ec": 0.07862557543382989,
    "mja": new THREE.Vector3(-0.8737644451201129, 0.4537075401009172, 0.17517180851814051),
    "mna": new THREE.Vector3(-0.4513627687667812, -0.8906217995307261, 0.05535757555959228),
    "jd": 2455779.5
  }
);

var Charon = new Body('Charon')
Charon.radiusKm = 605.0;
Charon.spacecraft = false;
Pluto.addSatellite(Charon);
Charon.ephemerides.splice(-1, 0,
  {
    "a": 0.0001163536334933381,
    "b": 0.00011635299421399869,
    "qr": 0.000115967933429509,
    "ta": 177.5142133343694,
    "oa": new THREE.Vector3(-0.6781147502433327, 0.6235244525542674, -0.38907279854716625),
    "an": [
      -0.6768559563627763,
      -0.7361154898086519,
      0.0
    ],
    "n": 56.72842860554361,
    "ma": 177.4976972490934,
    "ec": 0.003314894879077369,
    "mja": new THREE.Vector3(0.22655100006405013, 0.6809413830344537, 0.6964147307754943),
    "mna": new THREE.Vector3(0.6991673833013105, 0.38410426961702293, -0.6030164841773166),
    "jd": 2455779.5
  }
);

var Deimos = new Body('Deimos')
Deimos.radiusKm = 7.8;
Deimos.spacecraft = false;
Mars.addSatellite(Deimos);
Deimos.ephemerides.splice(-1, 0,
  {
    "a": 0.0001568135316281962,
    "b": 0.00015681352423235057,
    "qr": 0.0001567653700533899,
    "ta": 18.32201459386717,
    "oa": new THREE.Vector3(0.44108777750554456, -0.08434862021995491, 0.8934914005194505),
    "an": [
      0.18782525071285153,
      0.9822024614073488,
      0.0
    ],
    "n": 285.1272628627081,
    "ma": 18.31095349528123,
    "ec": 0.0003071263959570378,
    "mja": new THREE.Vector3(0.897307490115629, 0.022858338484880503, -0.4408137526712398),
    "mna": new THREE.Vector3(0.016758302945396063, 0.9961740844996424, 0.08576918242404966),
    "jd": 2455779.5
  }
);

var Dione = new Body('Dione')
Dione.radiusKm = 562.5;
Dione.spacecraft = false;
Saturn.addSatellite(Dione);
Dione.ephemerides.splice(-1, 0,
  {
    "a": 0.002519866385983374,
    "b": 0.002519860690458643,
    "qr": 0.002514508784822323,
    "ta": 45.48209448946213,
    "oa": new THREE.Vector3(0.08599644940095383, 0.46209961501335, 0.8826486030663294),
    "an": [
      -0.9831207026974542,
      0.18295814802206511,
      0.0
    ],
    "n": 131.7445760099957,
    "ma": 45.30856686414313,
    "ec": 0.00212614493802205,
    "mja": new THREE.Vector3(0.8356167640781602, -0.5158935803995817, 0.18867548143318635),
    "mna": new THREE.Vector3(0.542539615403312, 0.7213305480201251, -0.4305032011623286),
    "jd": 2455779.5
  }
);

var Enceladus = new Body('Enceladus')
Enceladus.radiusKm = 252.3;
Enceladus.spacecraft = false;
Saturn.addSatellite(Enceladus);
Enceladus.ephemerides.splice(-1, 0,
  {
    "a": 0.001594765011681366,
    "b": 0.001594753146373012,
    "qr": 0.001588613213859106,
    "ta": 130.5609099108865,
    "oa": new THREE.Vector3(0.0854915891154982, 0.4625175119666408, 0.88247874723117),
    "an": [
      -0.983342780612024,
      0.18176076534338453,
      0.0
    ],
    "n": 261.6707006416012,
    "ma": 130.2244558643026,
    "ec": 0.00385749485171748,
    "mja": new THREE.Vector3(0.7752661109601993, -0.5872219143132512, 0.23266473851215386),
    "mna": new THREE.Vector3(0.625822375268858, 0.664264988144392, -0.40877668737144984),
    "jd": 2455779.5
  }
);

var Eris = new Body('Eris')
Eris.radiusKm = 0.001;
Eris.spacecraft = false;
Sun.addSatellite(Eris);
Eris.ephemerides.splice(-1, 0,
  {
    "a": 68.0715576072167,
    "b": 61.33165746205319,
    "qr": 38.53912208235697,
    "ta": 189.511461416042,
    "oa": new THREE.Vector3(0.40759892838681483, -0.5596929795974445, 0.7215309294598915),
    "an": [
      0.8083584117802621,
      0.5886906472028345,
      0.0
    ],
    "n": 0.001754912799774141,
    "ma": 201.5524790267076,
    "ec": 0.4338439807014026,
    "mja": new THREE.Vector3(-0.9129225012065927, -0.23169965866028627, 0.33598776014522524),
    "mna": new THREE.Vector3(-0.02087152051525662, -0.7956500718067219, -0.6053968474193929),
    "jd": 2455779.5
  }
);

var Europa = new Body('Europa')
Europa.radiusKm = 1565.0;
Europa.spacecraft = false;
Jupiter.addSatellite(Europa);
Europa.ephemerides.splice(-1, 0,
  {
    "a": 0.004486321834315255,
    "b": 0.00448610132437267,
    "qr": 0.004441841405859979,
    "ta": 29.35465705000679,
    "oa": new THREE.Vector3(-0.008597989269593471, -0.04181820509203938, 0.9990882404990064),
    "an": [
      0.9795108639640134,
      -0.20139132895055833,
      0.0
    ],
    "n": 101.3459356848002,
    "ma": 28.80129730562597,
    "ec": 0.009914676230994499,
    "mja": new THREE.Vector3(0.9080993081900208, -0.4186423333308573, -0.009707894112588445),
    "mna": new THREE.Vector3(0.41866659891293684, 0.9071878716485224, 0.04157456540360565),
    "jd": 2455779.5
  }
);

var Ganymede = new Body('Ganymede')
Ganymede.radiusKm = 2634.0;
Ganymede.spacecraft = false;
Jupiter.addSatellite(Ganymede);
Ganymede.ephemerides.splice(-1, 0,
  {
    "a": 0.007157239060752818,
    "b": 0.007157235236978631,
    "qr": 0.007149840728689256,
    "ta": 253.365237840499,
    "oa": new THREE.Vector3(-0.012698328293742666, -0.03757348517288038, 0.9992131832949903),
    "an": [
      0.9473602121397204,
      -0.32016968697018144,
      0.0
    ],
    "n": 50.29088971715775,
    "ma": 253.4787573034961,
    "ec": 0.00103368519631144,
    "mja": new THREE.Vector3(0.11242666248430529, -0.9930108808025111, -0.03591150470895357),
    "mna": new THREE.Vector3(0.993578883642957, 0.11188218723185757, 0.016833839699579314),
    "jd": 2455779.5
  }
);

var Hyperion = new Body('Hyperion')
Hyperion.radiusKm = 133.0;
Hyperion.spacecraft = false;
Saturn.addSatellite(Hyperion);
Hyperion.ephemerides.splice(-1, 0,
  {
    "a": 0.009881649419481801,
    "b": 0.00985293781918171,
    "qr": 0.009128913356253937,
    "ta": 267.0413227233777,
    "oa": new THREE.Vector3(0.08873744121860361, 0.4462624110075941, 0.8904917332842928),
    "an": [
      -0.9807977561753554,
      0.19502759158998012,
      0.0
    ],
    "n": 16.96508735084537,
    "ma": 275.7760367486962,
    "ec": 0.07617514356903177,
    "mja": new THREE.Vector3(-0.8270416192393356, 0.5312395552673443, -0.18381157462285116),
    "mna": new THREE.Vector3(-0.5550926288214902, -0.7201627562162897, 0.41621842581390356),
    "jd": 2455779.5
  }
);

var Iapetus = new Body('Iapetus')
Iapetus.radiusKm = 734.5;
Iapetus.spacecraft = false;
Saturn.addSatellite(Iapetus);
Iapetus.ephemerides.splice(-1, 0,
  {
    "a": 0.02380352060723712,
    "b": 0.023793620708633143,
    "qr": 0.02311707550901998,
    "ta": 342.226558064334,
    "oa": new THREE.Vector3(0.19220003230473556, 0.2234367908216485, 0.9555810526006582),
    "an": [
      -0.758110729545535,
      0.6521258480906401,
      0.0
    ],
    "n": 4.537706554928041,
    "ma": 343.2148790203444,
    "ec": 0.02883796517093491,
    "mja": new THREE.Vector3(0.9622992737115215, 0.1480507710045071, -0.22816896594245598),
    "mna": new THREE.Vector3(-0.1924558531101025, 0.9634090355151828, -0.18655769855829812),
    "jd": 2455779.5
  }
);

var Io = new Body('Io')
Io.radiusKm = 1821.3;
Io.spacecraft = false;
Jupiter.addSatellite(Io);
Io.ephemerides.splice(-1, 0,
  {
    "a": 0.00282079101076305,
    "b": 0.002820764199159368,
    "qr": 0.002808492265199406,
    "ta": 50.25684433482327,
    "oa": new THREE.Vector3(-0.013928982610402749, -0.03626764014952043, 0.9992450358752972),
    "an": [
      0.9335189264845007,
      -0.3585281214845293,
      0.0
    ],
    "n": 203.2691320422335,
    "ma": 49.87347741697086,
    "ec": 0.004360034301270774,
    "mja": new THREE.Vector3(-0.9525951732908093, 0.30423253205263584, -0.002236574142498667),
    "mna": new THREE.Vector3(-0.3039217321392008, -0.9519071513119475, -0.038786028601561086),
    "jd": 2455779.5
  }
);

var Juno = new Body('Juno')
Juno.radiusKm = 0.001;
Juno.spacecraft = true;
Sun.addSatellite(Juno);
Juno.ephemerides.splice(-1, 0,
  {
    "a": 1.732065784258746,
    "b": 1.5739944204883003,
    "qr": 1.009159534962502,
    "ta": 349.4597591402473,
    "oa": new THREE.Vector3(0.0009589827815073241, 0.0008957711960608768, 0.9999991389726238),
    "an": [
      -0.6826116705002138,
      0.7307812992249512,
      0.0
    ],
    "n": 0.4323719385776768,
    "ma": 356.0495471880179,
    "ec": 0.4173665087470217,
    "mja": new THREE.Vector3(0.8055093186170198, -0.5925830568164832, -0.0002416509413955835),
    "mna": new THREE.Vector3(0.592582330122296, 0.8055088567905366, -0.0012898289938757335),
    "jd": 2455779.5
  }
);

var Mimas = new Body('Mimas')
Mimas.radiusKm = 198.8;
Mimas.spacecraft = false;
Saturn.addSatellite(Mimas);
Mimas.ephemerides.splice(-1, 0,
  {
    "a": 0.001239117800311762,
    "b": 0.00123889453642411,
    "qr": 0.001215596519140236,
    "ta": 155.8548851696193,
    "oa": new THREE.Vector3(0.09966628377271151, 0.441002874886473, 0.8919546491951277),
    "an": [
      -0.9754005983585092,
      0.2204397258251381,
      0.0
    ],
    "n": 382.0597900936946,
    "ma": 154.9534323154385,
    "ec": 0.01898228010735327,
    "mja": new THREE.Vector3(-0.954880696337879, -0.20965190414561993, 0.21035430789361928),
    "mna": new THREE.Vector3(0.27976684514113714, -0.8726755086685898, 0.40020990608653517),
    "jd": 2455779.5
  }
);

var Miranda = new Body('Miranda')
Miranda.radiusKm = 240.0;
Miranda.spacecraft = false;
Uranus.addSatellite(Miranda);
Miranda.ephemerides.splice(-1, 0,
  {
    "a": 0.0008681954646547767,
    "b": 0.0008681945485594549,
    "qr": 0.0008669342355844092,
    "ta": 122.0643720944501,
    "oa": new THREE.Vector3(0.2622336881052124, 0.9619713504354895, -0.07645007366941231),
    "an": [
      -0.9647949089357297,
      0.2630033910269924,
      0.0
    ],
    "n": 254.5841178609539,
    "ma": 121.9232173636087,
    "ec": 0.001452701749448823,
    "mja": new THREE.Vector3(0.6034091211546784, -0.10163259008211249, 0.7909287257019689),
    "mna": new THREE.Vector3(0.7530809553627535, -0.25353882853425375, -0.6071137760711752),
    "jd": 2455779.5
  }
);


var Proteus = new Body('Proteus')
Proteus.radiusKm = 218.0;
Proteus.spacecraft = false;
Neptune.addSatellite(Proteus);
Proteus.ephemerides.splice(-1, 0,
  {
    "a": 0.0007857280645819022,
    "b": 0.0007857279088008961,
    "qr": 0.0007852332888827999,
    "ta": 256.8098897173018,
    "oa": new THREE.Vector3(0.364059795567232, -0.32206670154137973, 0.8739184773248596),
    "an": [
      0.662589815492981,
      0.7489824673548623,
      0.0
    ],
    "n": 321.1867555330047,
    "ma": 256.8801523195471,
    "ec": 0.0006297034831835774,
    "mja": new THREE.Vector3(0.7134476940726165, 0.699600734587632, -0.03938527627060373),
    "mna": new THREE.Vector3(-0.5987093226884072, 0.6378337180823083, 0.4844742459649296),
    "jd": 2455779.5
  }
);

var Puck = new Body('Puck')
Puck.radiusKm = 77.0;
Puck.spacecraft = false;
Uranus.addSatellite(Puck);
Puck.ephemerides.splice(-1, 0,
  {
    "a": 0.0005753219306698154,
    "b": 0.0005753218014612339,
    "qr": 0.0005749363492331224,
    "ta": 357.7716634641228,
    "oa": new THREE.Vector3(0.21258685183091514, 0.9669955555043577, -0.14045079588040665),
    "an": [
      -0.9766767073680179,
      0.21471518177522303,
      0.0
    ],
    "n": 471.945302707609,
    "ma": 357.7746480795853,
    "ec": 0.0006702011797882727,
    "mja": new THREE.Vector3(-0.9442468891710559, 0.24027836404076966, 0.2250869166892542),
    "mna": new THREE.Vector3(0.2514053355030567, 0.08476970808437687, 0.9641625661017366),
    "jd": 2455779.5
  }
);

var Rhea = new Body('Rhea')
Rhea.radiusKm = 764.5;
Rhea.spacecraft = false;
Saturn.addSatellite(Rhea);
Rhea.ephemerides.splice(-1, 0,
  {
    "a": 0.003519231108634908,
    "b": 0.0035192298833437254,
    "qr": 0.003516294415904008,
    "ta": 272.8134636545424,
    "oa": new THREE.Vector3(0.08613211025624576, 0.45684146611997517, 0.8853683608623913),
    "an": [
      -0.9826868805578414,
      0.1852741071480274,
      0.0
    ],
    "n": 79.82261371824248,
    "ma": 272.908968664872,
    "ec": 0.0008344699851320741,
    "mja": new THREE.Vector3(0.7902096063548858, 0.5098895197958843, -0.3399727277691242),
    "mna": new THREE.Vector3(-0.6067536877574478, 0.7289091523884675, -0.3170826547716912),
    "jd": 2455779.5
  }
);

var Tethys = new Body('Tethys')
Tethys.radiusKm = 536.3;
Tethys.spacecraft = false;
Saturn.addSatellite(Tethys);
Tethys.ephemerides.splice(-1, 0,
  {
    "a": 0.001966958143270952,
    "b": 0.0019669577252026814,
    "qr": 0.001965675705980838,
    "ta": 156.7903838613755,
    "oa": new THREE.Vector3(0.06651370485773393, 0.46224376023461106, 0.8842548462916479),
    "an": [
      -0.9898054229897122,
      0.1424262076310288,
      0.0
    ],
    "n": 191.0323351363022,
    "ma": 156.7609266883316,
    "ec": 0.0006519901272437905,
    "mja": new THREE.Vector3(-0.9704469532354748, -0.17605982760439903, 0.16503226369378018),
    "mna": new THREE.Vector3(0.2319668899263046, -0.8690993287467647, 0.4368726573612051),
    "jd": 2455779.5
  }
);

var Titan = new Body('Titan')
Titan.radiusKm = 2575.5;
Titan.spacecraft = false;
Saturn.addSatellite(Titan);
Titan.ephemerides.splice(-1, 0,
  {
    "a": 0.008166045201060955,
    "b": 0.00816266523260151,
    "qr": 0.007931118560917346,
    "ta": 359.5524610039671,
    "oa": new THREE.Vector3(0.08755969940079811, 0.4568764520210027, 0.8852102612540945),
    "an": [
      -0.9821263052691389,
      0.18822306048513326,
      0.0
    ],
    "n": 22.57503471443182,
    "ma": 359.5776658019009,
    "ec": 0.02876871660140774,
    "mja": new THREE.Vector3(0.9413786647956617, -0.32857110866120154, 0.07646722187111474),
    "mna": new THREE.Vector3(0.32579058996290755, 0.8266226068417493, -0.45886333188627243),
    "jd": 2455779.5
  }
);

var Titania = new Body('Titania')
Titania.radiusKm = 788.9;
Titania.spacecraft = false;
Uranus.addSatellite(Titania);
Titania.ephemerides.splice(-1, 0,
  {
    "a": 0.002916309213756246,
    "b": 0.0029163076382166813,
    "qr": 0.002913277791875941,
    "ta": 190.0968988879968,
    "oa": new THREE.Vector3(0.21245678414941582, 0.9677013464216764, -0.13570637053050771),
    "an": [
      -0.9767370422152504,
      0.21444055205255425,
      0.0
    ],
    "n": 41.35063588902694,
    "ma": 190.117797338254,
    "ec": 0.001039472037466248,
    "mja": new THREE.Vector3(0.6191635877571297, -0.24075457047560617, -0.7474447728031992),
    "mna": new THREE.Vector3(-0.7559752419653756, 0.07477526949989088, -0.6503153793403713),
    "jd": 2455779.5
  }
);

var Triton = new Body('Triton')
Triton.radiusKm = 1352.6;
Triton.spacecraft = false;
Neptune.addSatellite(Triton);
Triton.ephemerides.splice(-1, 0,
  {
    "a": 0.002370961385936812,
    "b": 0.002370961385785741,
    "qr": 0.002370934620899851,
    "ta": 356.7706215090637,
    "oa": new THREE.Vector3(-0.48298611416723547, 0.5994545342560675, -0.6382622304989347),
    "an": [
      -0.7786954048818697,
      -0.6274021568466759,
      0.0
    ],
    "n": 61.25524164130429,
    "ma": 356.7706943807248,
    "ec": 1.128868530649856e-05,
    "mja": new THREE.Vector3(0.34281933452443547, -0.5412773468911045, -0.7677849553219639),
    "mna": new THREE.Vector3(-0.8057290595466053, -0.5896381051987465, 0.05592483795036468),
    "jd": 2455779.5
  }
);

var Umbriel = new Body('Umbriel')
Umbriel.radiusKm = 584.7;
Umbriel.spacecraft = false;
Uranus.addSatellite(Umbriel);
Umbriel.ephemerides.splice(-1, 0,
  {
    "a": 0.001777716738777725,
    "b": 0.0017777029191155763,
    "qr": 0.001770707124061592,
    "ta": 164.5087060374493,
    "oa": new THREE.Vector3(0.2115376691341663, 0.9681661669875399, -0.13381363023974474),
    "an": [
      -0.9769523737084836,
      0.21345739505896547,
      0.0
    ],
    "n": 86.88697004096372,
    "ma": 164.3876785596944,
    "ec": 0.003943043660011076,
    "mja": new THREE.Vector3(-0.9633584052980374, 0.22964134144991152, 0.13858368316186215),
    "mna": new THREE.Vector3(0.16490117488637307, 0.09959481611881366, 0.9812688087997874),
    "jd": 2455779.5
  }
);

Mercury.color  = 0x00ff00;
Venus.color    = 0xffff00;
Earth.color    = 0x0000ff;
Mars.color     = 0xff0000;
Jupiter.color  = 0xa52a2a;
Saturn.color   = 0xffa500;
Uranus.color   = 0x00ffff;
Neptune.color  = 0x0000ff;
Pluto.color    = 0xb22222;

Juno.color        = 0xffc0cb;

// Manual radii for gas giants
Jupiter.radiusKm = 69911;
Saturn.radiusKm  = 58232;
Uranus.radiusKm  = 25362;
Neptune.radiusKm = 24622;

// ... and minor planets
Pluto.radiusKm = 1186;
Ceres.radiusKm = 1163;
Ceres.radiusKm = 490;

Sun.texture = "images/sunmap.jpg";
Mercury.texture  = "images/mercurymap.jpg";
Venus.texture    = "images/venusmap.jpg";
Earth.texture    = "images/earthmap-stacked-clouds.png";
Mars.texture     = "images/mars_1k_color.jpg";
Jupiter.texture  = "images/jupiter2_1k.jpg";
Saturn.texture   = "images/saturnmap.jpg";
Uranus.texture   = "images/uranusmap.jpg";
Neptune.texture  = "images/neptunemap.jpg";
Pluto.texture    = "images/plutomap1k.jpg";

Moon.texture      = "images/moonmap1k.jpg" ;


