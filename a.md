Build words · PY

import json

weeks = []

def W(title, pairs):
    weeks.append({"title": title, "words": pairs})

# Semana 1
W("Semana 1 – Pronombres, verbos SER/ESTAR/TENER/HACER y saludos", [
("I","yo"),("you","tú / usted"),("he","él"),("she","ella"),("it","eso / ello"),
("we","nosotros"),("they","ellos"),("my","mi"),("your","tu"),("his","su (de él)"),
("her","su (de ella)"),("its","su (de eso)"),("our","nuestro"),("their","su (de ellos)"),
("mine","mío"),("this","este/esto"),("that","ese/eso"),("these","estos"),("those","esos"),
("am","soy/estoy"),("is","es/está"),("are","son/están"),("was","era/estaba"),("were","eran/estaban"),
("be","ser/estar"),("been","sido/estado"),("being","siendo"),
("have","tener"),("has","tiene"),("had","tenía/tuvo"),("having","teniendo"),
("do","hacer"),("does","hace"),("did","hizo"),("doing","haciendo"),("done","hecho"),
("hello","hola"),("hi","hola"),("goodbye","adiós"),("bye","chao"),("good morning","buenos días"),
("good afternoon","buenas tardes"),("good evening","buenas noches (saludo)"),("good night","buenas noches (despedida)"),
("please","por favor"),("thank you","gracias"),("thanks","gracias"),("sorry","perdón"),
("excuse me","disculpe"),("yes","sí"),("no","no"),("ok","de acuerdo"),("welcome","bienvenido"),
("nice to meet you","mucho gusto"),("how are you","¿cómo estás?"),("fine","bien"),
("one","uno"),("two","dos"),("three","tres"),("four","cuatro"),("five","cinco"),
("six","seis"),("seven","siete"),("eight","ocho"),("nine","nueve"),("ten","diez"),
("eleven","once"),("twelve","doce"),("thirteen","trece"),("fourteen","catorce"),("fifteen","quince"),
("sixteen","dieciséis"),("seventeen","diecisiete"),("eighteen","dieciocho"),("nineteen","diecinueve"),("twenty","veinte"),
("what","qué"),("who","quién"),("where","dónde"),("when","cuándo"),("why","por qué"),
("how","cómo"),("which","cuál"),("name","nombre"),("age","edad"),("and","y"),
("or","o"),("but","pero"),("a","un/una"),("an","un/una (ante vocal)"),("the","el/la"),
("not","no"),("very","muy"),("too","también"),("here","aquí"),("there","allí"),
])

# Semana 2
W("Semana 2 – Números, días, meses y expresiones de tiempo", [
("twenty-one","veintiuno"),("thirty","treinta"),("forty","cuarenta"),("fifty","cincuenta"),
("sixty","sesenta"),("seventy","setenta"),("eighty","ochenta"),("ninety","noventa"),
("hundred","cien"),("thousand","mil"),("first","primero"),("second","segundo"),
("third","tercero"),("fourth","cuarto"),("fifth","quinto"),("last","último"),
("Monday","lunes"),("Tuesday","martes"),("Wednesday","miércoles"),("Thursday","jueves"),
("Friday","viernes"),("Saturday","sábado"),("Sunday","domingo"),("day","día"),
("week","semana"),("weekend","fin de semana"),
("January","enero"),("February","febrero"),("March","marzo"),("April","abril"),
("May","mayo"),("June","junio"),("July","julio"),("August","agosto"),
("September","septiembre"),("October","octubre"),("November","noviembre"),("December","diciembre"),
("spring","primavera"),("summer","verano"),("autumn / fall","otoño"),("winter","invierno"),("season","estación"),
("today","hoy"),("tomorrow","mañana"),("yesterday","ayer"),("morning","mañana (parte del día)"),
("afternoon","tarde"),("evening","noche (temprana)"),("night","noche"),
("o'clock","en punto"),("hour","hora"),("minute","minuto"),("second (time)","segundo (tiempo)"),
("time","tiempo/hora"),("early","temprano"),("late","tarde"),("always","siempre"),
("never","nunca"),("sometimes","a veces"),("often","a menudo"),("usually","usualmente"),
("half","medio/media"),("quarter","cuarto (fracción)"),("past","pasado / y (hora)"),("to (time)","menos (hora)"),
("date","fecha"),("year","año"),("month","mes"),("calendar","calendario"),
("birthday","cumpleaños"),("holiday","día festivo"),("vacation","vacaciones"),
("soon","pronto"),("later","más tarde"),("before","antes"),("after","después"),
("still","todavía"),("already","ya"),("ago","hace (tiempo)"),("since","desde"),
("until","hasta"),("while","mientras"),("noon","mediodía"),("midnight","medianoche"),
("century","siglo"),("decade","década"),("weekday","día de semana"),
])

# Semana 3
W("Semana 3 – Familia y personas", [
("mother / mom","madre / mamá"),("father / dad","padre / papá"),("parents","padres"),
("brother","hermano"),("sister","hermana"),("sibling","hermano/a"),("son","hijo"),
("daughter","hija"),("child","niño/a"),("children","niños"),("baby","bebé"),
("husband","esposo"),("wife","esposa"),("grandmother / grandma","abuela"),
("grandfather / grandpa","abuelo"),("grandparents","abuelos"),("aunt","tía"),
("uncle","tío"),("cousin","primo/a"),("nephew","sobrino"),("niece","sobrina"),
("family","familia"),("friend","amigo/a"),("boyfriend","novio"),("girlfriend","novia"),
("man","hombre"),("woman","mujer"),("boy","niño"),("girl","niña"),
("people","gente"),("person","persona"),("adult","adulto"),("teenager","adolescente"),
("neighbor","vecino"),("guest","invitado"),("stranger","desconocido"),("couple","pareja"),
("twins","gemelos"),("married","casado"),("single","soltero"),("divorced","divorciado"),
("old","viejo"),("young","joven"),("tall","alto"),("short (person)","bajo (estatura)"),
("surname / last name","apellido"),("nickname","apodo"),
("American","estadounidense"),("English","inglés/a"),("Spanish","español/a"),
("French","francés/a"),("German","alemán/a"),("Chinese","chino/a"),
("Japanese","japonés/a"),("Mexican","mexicano/a"),("Canadian","canadiense"),
("Brazilian","brasileño/a"),("country","país"),("nationality","nacionalidad"),
("language","idioma"),("introduce","presentar"),("meet","conocer/encontrarse"),
("relative","pariente"),("only child","hijo único"),("widow","viuda"),
("widower","viudo"),("engaged","comprometido"),("wedding","boda"),
("love","amor"),("hate","odio"),("kiss","beso"),("hug","abrazo"),
("smile","sonrisa"),("laugh","risa"),("cry","llorar"),("care","cuidar"),
("help","ayudar"),("visit","visitar"),("call (phone)","llamar"),("invite","invitar"),
("everyone","todos"),("someone","alguien"),("no one","nadie"),("anybody","alguien/nadie"),
("myself","yo mismo"),("yourself","tú mismo"),("himself","él mismo"),("herself","ella misma"),
("ourselves","nosotros mismos"),("themselves","ellos mismos"),
])

# Semana 4
W("Semana 4 – Colores, formas y adjetivos básicos", [
("red","rojo"),("blue","azul"),("green","verde"),("yellow","amarillo"),
("orange (color)","naranja"),("purple","morado"),("pink","rosado"),("black","negro"),
("white","blanco"),("brown","marrón"),("gray / grey","gris"),("color / colour","color"),
("circle","círculo"),("square","cuadrado"),("triangle","triángulo"),("rectangle","rectángulo"),
("star (shape)","estrella"),("heart (shape)","corazón"),("shape","forma"),
("big","grande"),("small","pequeño"),("large","grande"),("tiny","diminuto"),
("long","largo"),("short (length)","corto"),("tall","alto"),("wide","ancho"),
("narrow","estrecho"),("thick","grueso"),("thin","delgado"),("heavy","pesado"),
("light (weight)","ligero"),("high","alto (altura)"),("low","bajo"),
("good","bueno"),("bad","malo"),("nice","agradable"),("beautiful","hermoso"),
("ugly","feo"),("pretty","bonito"),("new","nuevo"),("old (thing)","viejo/antiguo"),
("clean","limpio"),("dirty","sucio"),("easy","fácil"),("difficult / hard","difícil"),
("hot","caliente"),("cold","frío"),("warm","cálido"),("cool","fresco"),
("fast","rápido"),("slow","lento"),("strong","fuerte"),("weak","débil"),
("rich","rico"),("poor","pobre"),("happy","feliz"),("sad","triste"),
("angry","enojado"),("tired","cansado"),("hungry","hambriento"),("thirsty","sediento"),
("full","lleno"),("empty","vacío"),("open","abierto"),("closed","cerrado"),
("right (correct)","correcto"),("wrong","incorrecto"),("same","mismo"),("different","diferente"),
("expensive","caro"),("cheap","barato"),("quiet","silencioso"),("noisy","ruidoso"),
("safe","seguro"),("dangerous","peligroso"),("interesting","interesante"),("boring","aburrido"),
("funny","gracioso"),("serious","serio"),("kind","amable"),("friendly","amistoso"),
("shy","tímido"),("brave","valiente"),("lazy","perezoso"),("busy","ocupado"),
("free (available)","libre"),("round","redondo"),("flat","plano"),("straight","recto"),
])

# Semana 5
W("Semana 5 – La casa y los muebles", [
("house","casa"),("home","hogar"),("apartment / flat","apartamento"),("room","habitación"),
("bedroom","dormitorio"),("bathroom","baño"),("kitchen","cocina"),("living room","sala"),
("dining room","comedor"),("garden","jardín"),("yard","patio"),("garage","garaje"),
("roof","techo"),("door","puerta"),("window","ventana"),("wall","pared"),
("floor","piso"),("ceiling","cielo raso"),("stairs","escaleras"),
("table","mesa"),("chair","silla"),("sofa / couch","sofá"),("bed","cama"),
("desk","escritorio"),("shelf","estante"),("wardrobe / closet","armario"),("drawer","cajón"),
("mirror","espejo"),("lamp","lámpara"),("curtain","cortina"),("carpet / rug","alfombra"),
("fridge / refrigerator","refrigerador"),("oven","horno"),("stove","estufa"),
("microwave","microondas"),("washing machine","lavadora"),("dishwasher","lavavajillas"),
("television / TV","televisor"),("computer","computadora"),("telephone / phone","teléfono"),
("radio","radio"),("clock","reloj"),("fan","ventilador"),("heater","calentador"),
("air conditioner","aire acondicionado"),
("plate","plato"),("cup","taza"),("glass","vaso"),("bowl","tazón"),
("spoon","cuchara"),("fork","tenedor"),("knife","cuchillo"),("pan","sartén"),
("pot","olla"),("kettle","tetera"),
("key","llave"),("lock","cerradura"),("light (lamp)","luz"),("switch","interruptor"),
("towel","toalla"),("soap","jabón"),("toothbrush","cepillo de dientes"),("pillow","almohada"),
("blanket","manta"),("sheet","sábana"),("basement","sótano"),("attic","ático"),
("balcony","balcón"),("fence","cerca"),("driveway","entrada de auto"),("mailbox","buzón"),
("furniture","muebles"),("address","dirección"),("neighborhood","vecindario"),
("upstairs","arriba"),("downstairs","abajo"),("move (house)","mudarse"),
("rent","alquilar"),("own","poseer"),("decorate","decorar"),("paint","pintar"),
])

# Semana 6
W("Semana 6 – Comida y bebidas", [
("bread","pan"),("rice","arroz"),("pasta","pasta"),("meat","carne"),
("chicken","pollo"),("beef","carne de res"),("pork","cerdo"),("fish","pescado"),
("egg","huevo"),("cheese","queso"),("milk","leche"),("butter","mantequilla"),
("sugar","azúcar"),("salt","sal"),("pepper (spice)","pimienta"),("oil","aceite"),
("water","agua"),("juice","jugo"),("coffee","café"),("tea","té"),
("wine","vino"),("beer","cerveza"),("soda","refresco"),
("apple","manzana"),("banana","banana"),("orange (fruit)","naranja (fruta)"),
("grape","uva"),("strawberry","fresa"),("lemon","limón"),("watermelon","sandía"),
("pineapple","piña"),("mango","mango"),("pear","pera"),("peach","durazno"),("cherry","cereza"),
("potato","papa"),("tomato","tomate"),("onion","cebolla"),("carrot","zanahoria"),
("lettuce","lechuga"),("cucumber","pepino"),("corn","maíz"),("garlic","ajo"),
("broccoli","brócoli"),("pea","guisante"),
("breakfast","desayuno"),("lunch","almuerzo"),("dinner","cena"),("snack","merienda"),
("meal","comida"),("food","comida/alimento"),("drink","bebida"),
("delicious","delicioso"),("tasty","sabroso"),("sweet","dulce"),("sour","agrio"),
("bitter","amargo"),("spicy","picante"),("fresh","fresco"),("cooked","cocinado"),("raw","crudo"),
("restaurant","restaurante"),("menu","menú"),("waiter / waitress","mesero/a"),
("bill (check)","cuenta"),("order (food)","pedir/pedido"),("cook (person)","cocinero"),
("chef","chef"),
("eat","comer"),("drink (verb)","beber"),("cook (verb)","cocinar"),("buy","comprar"),
("cut","cortar"),("taste (verb)","probar"),
])

# Semana 7
W("Semana 7 – Ropa y cuerpo", [
("shirt","camisa"),("t-shirt","camiseta"),("pants / trousers","pantalones"),("jeans","jeans"),
("dress","vestido"),("skirt","falda"),("jacket","chaqueta"),("coat","abrigo"),
("sweater","suéter"),("suit","traje"),("shoes","zapatos"),("socks","calcetines"),
("hat","sombrero"),("cap","gorra"),("gloves","guantes"),("scarf","bufanda"),
("belt","cinturón"),("tie","corbata"),("underwear","ropa interior"),("pajamas","pijama"),
("shorts","pantalones cortos"),("boots","botas"),("sandals","sandalias"),
("head","cabeza"),("hair","cabello"),("face","cara"),("eye","ojo"),
("ear","oreja"),("nose","nariz"),("mouth","boca"),("teeth","dientes"),
("tongue","lengua"),("neck","cuello"),("shoulder","hombro"),("arm","brazo"),
("elbow","codo"),("hand","mano"),("finger","dedo"),("chest","pecho"),
("back","espalda"),("stomach","estómago"),("leg","pierna"),("knee","rodilla"),
("foot / feet","pie / pies"),("toe","dedo del pie"),("skin","piel"),("heart (body)","corazón (órgano)"),
("brain","cerebro"),("bone","hueso"),("blood","sangre"),("muscle","músculo"),
("nail","uña"),("lip","labio"),("eyebrow","ceja"),("eyelash","pestaña"),
("chin","mentón"),("cheek","mejilla"),("forehead","frente"),("waist","cintura"),
("wear","llevar puesto"),("put on","ponerse"),("take off","quitarse"),
("dress (verb)","vestirse"),("try on","probarse"),("size","talla"),
("fashion","moda"),("style","estilo"),("fabric","tela"),("cotton","algodón"),
("wool","lana"),("leather","cuero"),("button","botón"),("zipper","cremallera"),
("pocket","bolsillo"),("sleeve","manga"),("collar","cuello (ropa)"),("umbrella","paraguas"),
])

# Semana 8
W("Semana 8 – Verbos de la rutina diaria", [
("wake up","despertarse"),("get up","levantarse"),("sleep","dormir"),("go to bed","irse a la cama"),
("wash","lavar"),("take a shower","ducharse"),("brush (teeth)","cepillarse"),("comb","peinar"),
("get dressed","vestirse"),("have breakfast","desayunar"),("go to work","ir al trabajo"),
("go to school","ir a la escuela"),("study","estudiar"),("work","trabajar"),
("read","leer"),("write","escribir"),("listen","escuchar"),("speak","hablar"),
("talk","conversar"),("watch","mirar/ver"),("walk","caminar"),("run","correr"),
("drive","conducir"),("ride","montar"),("travel","viajar"),("arrive","llegar"),
("leave","salir/irse"),("come","venir"),("go","ir"),("stay","quedarse"),
("live","vivir"),("rest","descansar"),("relax","relajarse"),("play","jugar"),
("dance","bailar"),("sing","cantar"),("clean","limpiar"),("wash dishes","lavar platos"),
("do homework","hacer tarea"),("exercise","ejercitarse"),("swim","nadar"),("jump","saltar"),
("sit","sentarse"),("stand","pararse"),("wait","esperar"),("need","necesitar"),
("want","querer"),("like","gustar"),("know","saber/conocer"),("think","pensar"),
("remember","recordar"),("forget","olvidar"),("understand","entender"),("learn","aprender"),
("teach","enseñar"),("ask","preguntar"),("answer","responder"),("say","decir"),
("tell","contar/decir"),("give","dar"),("take","tomar"),("bring","traer"),
("send","enviar"),("receive","recibir"),("sell","vender"),("pay","pagar"),
("spend","gastar"),("save","ahorrar"),("lose","perder"),("find","encontrar"),
("look for","buscar"),("look at","mirar"),("see","ver"),("hear","oír"),
("feel","sentir"),("smell","oler"),("touch","tocar"),("start","empezar"),
("finish","terminar"),("stop","parar"),("continue","continuar"),("try","intentar"),
("use","usar"),("make","hacer/fabricar"),("fix","arreglar"),("break","romper"),
])

# Semana 9
W("Semana 9 – Clima y lugares de la ciudad", [
("sun","sol"),("sunny","soleado"),("rain","lluvia"),("rainy","lluvioso"),
("cloud","nube"),("cloudy","nublado"),("wind","viento"),("windy","ventoso"),
("snow","nieve"),("snowy","nevado"),("storm","tormenta"),("fog","niebla"),
("temperature","temperatura"),("degree","grado"),("weather forecast","pronóstico del tiempo"),
("weather","clima"),
("city","ciudad"),("town","pueblo"),("village","aldea"),("street","calle"),
("road","carretera"),("avenue","avenida"),("park","parque"),("square (place)","plaza"),
("bridge","puente"),("building","edificio"),("church","iglesia"),("school","escuela"),
("hospital","hospital"),("bank","banco"),("supermarket","supermercado"),("market","mercado"),
("store / shop","tienda"),("mall","centro comercial"),("museum","museo"),("library","biblioteca"),
("cinema / movie theater","cine"),("theater","teatro"),("hotel","hotel"),("airport","aeropuerto"),
("station","estación"),("bus stop","parada de bus"),("café","cafetería"),
("gym","gimnasio"),("pool","piscina"),("beach","playa"),("mountain","montaña"),
("river","río"),("lake","lago"),("sea","mar"),("ocean","océano"),
("forest","bosque"),("farm","granja"),
("left","izquierda"),("right (direction)","derecha"),("straight","recto"),("near","cerca"),
("far","lejos"),("next to","al lado de"),("in front of","enfrente de"),("behind","detrás de"),
("between","entre"),("corner","esquina"),("map","mapa"),("address (place)","dirección"),
("downtown","centro (de la ciudad)"),("suburb","suburbio"),("traffic light","semáforo"),
("sidewalk","acera"),("crosswalk","cruce peatonal"),
])

# Semana 10
W("Semana 10 – Animales y naturaleza", [
("dog","perro"),("cat","gato"),("bird","pájaro"),("fish (animal)","pez"),
("horse","caballo"),("cow","vaca"),("pig","cerdo"),("sheep","oveja"),
("goat","cabra"),("duck","pato"),("rabbit","conejo"),("mouse","ratón"),
("lion","león"),("tiger","tigre"),("elephant","elefante"),("monkey","mono"),
("bear","oso"),("wolf","lobo"),("fox","zorro"),("deer","ciervo"),
("snake","serpiente"),("frog","rana"),("turtle","tortuga"),("butterfly","mariposa"),
("bee","abeja"),("spider","araña"),("ant","hormiga"),("fly (insect)","mosca"),
("mosquito","mosquito"),("owl","búho"),("eagle","águila"),("shark","tiburón"),
("whale","ballena"),("dolphin","delfín"),
("tree","árbol"),("flower","flor"),("grass","pasto"),("leaf","hoja"),
("plant","planta"),("sky","cielo"),("star (sky)","estrella"),("moon","luna"),
("rock","roca"),("stone","piedra"),("sand","arena"),("earth","tierra"),
("world","mundo"),("nature","naturaleza"),("animal","animal"),("pet","mascota"),
("wild","salvaje"),("field","campo"),("island","isla"),("desert","desierto"),
("jungle","selva"),("valley","valle"),("hill","colina"),("wave","ola"),
("rainbow","arcoíris"),("root","raíz"),("branch","rama"),("seed","semilla"),
("cage","jaula"),("zoo","zoológico"),("aquarium","acuario"),("herd","manada"),
("flock","bandada"),("nest","nido"),("den","madriguera"),("feather","pluma"),
("fur","pelaje"),("tail","cola"),("paw","pata"),("wing","ala"),
("claw","garra"),("hoof","pezuña"),("predator","depredador"),("prey","presa"),
("species","especie"),("wildlife","fauna silvestre"),
])

# Semana 11
W("Semana 11 – Profesiones y escuela", [
("teacher","maestro/a"),("student","estudiante"),("doctor","médico"),("nurse","enfermero/a"),
("dentist","dentista"),("engineer","ingeniero"),("lawyer","abogado"),("police officer","policía"),
("firefighter","bombero"),("farmer","granjero"),("driver","conductor"),("pilot","piloto"),
("waiter / waitress","mesero/a"),("cashier","cajero"),("manager","gerente"),("boss","jefe"),
("employee","empleado"),("worker","trabajador"),("businessman / businesswoman","empresario/a"),
("artist","artista"),("musician","músico"),("actor / actress","actor / actriz"),
("writer","escritor"),("journalist","periodista"),("scientist","científico"),
("athlete","atleta"),("soldier","soldado"),("secretary","secretario/a"),
("receptionist","recepcionista"),("mechanic","mecánico"),("electrician","electricista"),
("plumber","plomero"),("hairdresser","peluquero"),("tailor","sastre"),
("baker","panadero"),("butcher","carnicero"),("job","trabajo/empleo"),
("career","carrera"),("company","empresa"),("office","oficina"),("salary","salario"),
("classroom","salón de clases"),("class","clase"),("lesson","lección"),
("subject","materia"),("math","matemáticas"),("science","ciencia"),
("history","historia"),("geography","geografía"),("art","arte"),
("music","música"),("physical education","educación física"),("book","libro"),
("notebook","cuaderno"),("pen","bolígrafo"),("pencil","lápiz"),
("eraser","borrador"),("ruler","regla"),("backpack","mochila"),
("homework","tarea"),("exam / test","examen"),("grade (school)","calificación"),
("question","pregunta"),("blackboard / whiteboard","pizarra"),("desk (school)","pupitre"),
("principal","director/a"),("university","universidad"),("degree","título"),
])

# Semana 12
W("Semana 12 – Transporte y viajes", [
("car","carro"),("bus","autobús"),("train","tren"),("plane / airplane","avión"),
("bike / bicycle","bicicleta"),("motorcycle","motocicleta"),("taxi","taxi"),("truck","camión"),
("boat","bote"),("ship","barco"),("subway / metro","metro"),
("trip","viaje"),("journey","travesía"),("tourist","turista"),("passport","pasaporte"),
("ticket","boleto"),("luggage","equipaje"),("suitcase","maleta"),("reservation","reservación"),
("flight","vuelo"),("gate (airport)","puerta de embarque"),("arrival","llegada"),
("departure","salida"),("destination","destino"),("souvenir","recuerdo"),
("fly (verb)","volar"),("park (verb)","estacionar"),("depart","partir"),
("book (verb)","reservar"),("pack","empacar"),
("traffic","tráfico"),("highway","autopista"),("crossing","cruce"),
("seatbelt","cinturón de seguridad"),("gas station","gasolinera"),("ticket office","taquilla"),
("platform","andén"),("terminal","terminal"),("captain","capitán"),
("passenger","pasajero"),("driver's license","licencia de conducir"),("fare","tarifa"),
("route","ruta"),("schedule","horario"),("delay","retraso"),("connection (travel)","conexión"),
("customs","aduana"),("border","frontera"),("visa","visa"),("guide (tourist)","guía"),
("seat","asiento"),("aisle","pasillo"),("cabin","cabina"),("crew","tripulación"),
("roundtrip","viaje redondo"),("one-way","de ida"),("boarding pass","tarjeta de embarque"),
("security check","control de seguridad"),("immigration","inmigración"),("currency","moneda (divisa)"),
("exchange rate","tipo de cambio"),("cruise","crucero"),("ferry","transbordador"),
("cable car","teleférico"),("elevator","ascensor"),("escalator","escalera mecánica"),
("carpool","compartir auto"),("rush hour","hora pico"),("parking lot","estacionamiento"),
("mileage","kilometraje"),("license plate","placa de matrícula"),("wheel","rueda"),
("tire","llanta"),("brake","freno"),("horn (car)","bocina"),
])

# Semana 13
W("Semana 13 – Emociones y adjetivos adicionales", [
("happy","feliz"),("sad","triste"),("angry","enojado"),("afraid","asustado"),
("scared","asustado"),("worried","preocupado"),("nervous","nervioso"),("excited","emocionado"),
("surprised","sorprendido"),("bored","aburrido"),("embarrassed","avergonzado"),
("confused","confundido"),("proud","orgulloso"),("jealous","celoso"),
("lonely","solitario"),("calm","tranquilo"),("relaxed","relajado"),("stressed","estresado"),
("sick / ill","enfermo"),("healthy","saludable"),("comfortable","cómodo"),
("uncomfortable","incómodo"),("confident","seguro de sí mismo"),("curious","curioso"),
("patient","paciente"),("impatient","impaciente"),
("important","importante"),("necessary","necesario"),("possible","posible"),
("impossible","imposible"),("true","verdadero"),("false","falso"),
("real","real"),("fake","falso/imitación"),("correct","correcto"),
("incorrect","incorrecto"),("popular","popular"),("famous","famoso"),
("normal","normal"),("strange","extraño"),("weird","raro"),
("special","especial"),("common","común"),("rare","raro/poco común"),
("modern","moderno"),("traditional","tradicional"),("similar","similar"),
("simple","simple"),("complicated","complicado"),("careful","cuidadoso"),
("careless","descuidado"),("honest","honesto"),("polite","cortés"),
("rude","grosero"),("generous","generoso"),("selfish","egoísta"),
("hopeful","esperanzado"),("disappointed","decepcionado"),("grateful","agradecido"),
("annoyed","molesto"),("relieved","aliviado"),("amazed","asombrado"),
])

# Semana 14
W("Semana 14 – Preposiciones, palabras de pregunta y conectores", [
("in","en"),("on","sobre/en"),("at","en (lugar/hora)"),("under","debajo de"),
("over","sobre/encima de"),("above","arriba de"),("below","debajo de"),
("inside","dentro"),("outside","afuera"),("up","arriba"),("down","abajo"),
("into","hacia dentro"),("onto","hacia encima"),("through","a través de"),
("across","a través de / cruzando"),("along","a lo largo de"),("around","alrededor de"),
("before (place/time)","antes"),("during","durante"),("for","para/por"),
("with","con"),("without","sin"),("about","acerca de"),("against","contra"),
("toward","hacia"),
("what","qué"),("who","quién"),("whom","a quién"),("whose","de quién"),
("where","dónde"),("when","cuándo"),("why","por qué"),("how","cómo"),
("which","cuál"),("how much","cuánto"),("how many","cuántos"),
("how often","con qué frecuencia"),("how long","cuánto tiempo"),
("and","y"),("or","o"),("but","pero"),("so","así que"),
("because","porque"),("if","si"),("while (conj.)","mientras"),("although","aunque"),
("however","sin embargo"),("also","también"),("either","tampoco/o"),
("neither","ni/tampoco"),("both","ambos"),("all","todo"),("every","cada"),
("each","cada uno"),("some","algo/algunos"),("any","alguno/ninguno"),
("many","muchos"),("much","mucho"),("few","pocos"),("little","poco"),
("several","varios"),("other","otro"),("another","otro (adicional)"),
("such","tal"),("than","que (comparación)"),
])

# Semana 15
W("Semana 15 – Adverbios comunes y verbos extra (repaso final)", [
("quickly","rápidamente"),("slowly","lentamente"),("carefully","cuidadosamente"),
("easily","fácilmente"),("well","bien"),("badly","mal"),
("loudly","ruidosamente"),("quietly","silenciosamente"),("suddenly","de repente"),
("finally","finalmente"),("immediately","inmediatamente"),("recently","recientemente"),
("yet","todavía/aún"),("again","de nuevo"),("almost","casi"),
("only","solo"),("just","justo/apenas"),("even","incluso"),
("maybe","quizás"),("perhaps","tal vez"),("probably","probablemente"),
("certainly","ciertamente"),("actually","en realidad"),("exactly","exactamente"),
("especially","especialmente"),("generally","generalmente"),("rarely","raramente"),
("hardly","apenas"),("enough","suficiente"),("a lot","mucho"),
("a little","un poco"),("more","más"),("less","menos"),
("most","la mayoría"),("least","lo menos"),
("agree","estar de acuerdo"),("disagree","no estar de acuerdo"),("decide","decidir"),
("choose","elegir"),("plan","planear"),("hope","esperar (deseo)"),
("wish","desear"),("believe","creer"),("guess","adivinar"),
("imagine","imaginar"),("dream","soñar"),("worry","preocuparse"),
("share","compartir"),("borrow","pedir prestado"),("lend","prestar"),
("promise","prometer"),("apologize","disculparse"),("congratulate","felicitar"),
("celebrate","celebrar"),("accept","aceptar"),("refuse","rechazar"),
("allow","permitir"),("suggest","sugerir"),("recommend","recomendar"),
("explain","explicar"),("describe","describir"),("depend","depender"),
])

# Semana 16
W("Semana 16 – Tecnología, comunicación y entretenimiento", [
("computer","computadora"),("laptop","laptop"),("tablet","tableta"),("smartphone","teléfono inteligente"),
("screen","pantalla"),("keyboard","teclado"),("mouse (device)","ratón (dispositivo)"),
("password","contraseña"),("internet","internet"),("website","sitio web"),
("email","correo electrónico"),("message","mensaje"),("text message","mensaje de texto"),
("app / application","aplicación"),("social media","redes sociales"),("photo / picture","foto"),
("video","video"),("camera","cámara"),("printer","impresora"),("charger","cargador"),
("battery","batería"),("wifi","wifi"),("download","descargar"),("upload","subir (archivo)"),
("click","hacer clic"),("type (keyboard)","escribir (teclado)"),("search","buscar"),
("save (file)","guardar"),("delete","borrar"),("share (online)","compartir"),
("post (verb)","publicar"),("comment","comentar/comentario"),("like (social media)","dar me gusta"),
("follow (online)","seguir"),("network","red"),("file","archivo"),("folder","carpeta"),
("document","documento"),("software","software"),("update","actualizar/actualización"),
("install","instalar"),
("soccer / football","fútbol"),("basketball","baloncesto"),("baseball","béisbol"),
("tennis","tenis"),("volleyball","voleibol"),("golf","golf"),
("swimming","natación"),("running","correr (actividad)"),("cycling","ciclismo"),
("hiking","senderismo"),("dancing","baile"),("painting (hobby)","pintura (afición)"),
("drawing","dibujo"),("photography","fotografía"),("gardening","jardinería"),
("chess","ajedrez"),("cards (game)","cartas"),("video games","videojuegos"),
("board games","juegos de mesa"),("fishing","pesca"),("camping","acampar"),
("yoga","yoga"),("team","equipo"),("player","jugador"),("coach","entrenador"),
("referee","árbitro"),("match","partido"),("game","juego/partido"),
("score","puntuación"),("win","ganar"),("tie (game)","empate"),
("championship","campeonato"),("competition","competencia"),("ball","pelota"),
("goal","gol/meta"),("court (sports)","cancha"),("stadium","estadio"),
("song","canción"),("instrument (music)","instrumento musical"),("guitar","guitarra"),
("piano","piano"),("drum","tambor"),("violin","violín"),("band (music)","banda"),
("concert","concierto"),("movie / film","película"),("TV show","programa de TV"),
("series","serie"),("episode","episodio"),("channel","canal"),
("program","programa"),("news","noticias"),("cartoon","dibujos animados"),
("comedy","comedia"),("drama","drama"),("horror movie","película de terror"),
("hobby","pasatiempo"),("interest (hobby)","interés"),("free time","tiempo libre"),
("activity","actividad"),("club","club"),("member","miembro"),
("event","evento"),("party","fiesta"),("festival","festival"),
])

# Semana 17
W("Semana 17 – Herramientas, cantidades, dinero y salud", [
("tool","herramienta"),("hammer","martillo"),("nail (tool)","clavo"),("screwdriver","destornillador"),
("screw","tornillo"),("saw","sierra"),("drill","taladro"),("ladder","escalera (de mano)"),
("rope","cuerda"),("tape","cinta"),("glue","pegamento"),("scissors","tijeras"),
("needle","aguja"),("thread","hilo"),("machine","máquina"),("engine","motor"),
("wire","cable/alambre"),("pipe","tubería"),("brick","ladrillo"),("wood","madera"),
("metal","metal"),("plastic","plástico"),("glass (material)","vidrio"),("paper","papel"),
("cardboard","cartón"),("rubber","goma"),("material","material"),
("quantity / amount","cantidad"),("number","número"),("pair","par"),("dozen","docena"),
("piece","pedazo"),("part","parte"),("whole","entero"),("percent","porcentaje"),
("price","precio"),("cost","costo"),("discount","descuento"),("sale","oferta/venta"),
("receipt","recibo"),("cash","efectivo"),("credit card","tarjeta de crédito"),
("money","dinero"),("coin","moneda"),("bill (money)","billete"),("change (money)","cambio (dinero)"),
("wallet","billetera"),("purse","bolso"),("budget","presupuesto"),
("debt","deuda"),("loan","préstamo"),("bank account","cuenta bancaria"),
("tax","impuesto"),("insurance","seguro"),("contract","contrato"),
("business","negocio"),("customer","cliente"),("seller","vendedor"),
("buyer","comprador"),("product","producto"),("service","servicio"),
("quality","calidad"),("brand","marca"),
("weight","peso"),("measure","medir"),("length","longitud"),("width","ancho"),
("height","altura"),("depth","profundidad"),("volume","volumen"),
("distance","distancia"),("speed","velocidad"),("direction","dirección (rumbo)"),
("north","norte"),("south","sur"),("east","este"),("west","oeste"),
("medicine","medicina"),("pill","pastilla"),("pharmacy","farmacia"),
("appointment","cita"),("injury","lesión"),("pain","dolor"),
("headache","dolor de cabeza"),("fever","fiebre"),("cough","tos"),
("cold (illness)","resfriado"),("flu","gripe"),("ambulance","ambulancia"),
("emergency","emergencia"),("accident","accidente"),("patient (person)","paciente"),
("treatment","tratamiento"),("vaccine","vacuna"),("health","salud"),
("diet","dieta"),("humidity","humedad"),("climate","clima (general)"),
("thunder","trueno"),("lightning","relámpago"),("earthquake","terremoto"),
("flood","inundación"),("pollution","contaminación"),("recycle","reciclar"),
("environment","medio ambiente"),("energy","energía"),("electricity","electricidad"),
("fuel","combustible"),("solar","solar"),
])

# Semana 18
W("Semana 18 – Verbos de acción, ideas y repaso general", [
("put","poner"),("keep","mantener/guardar"),("hold","sostener"),("carry (object)","llevar/cargar"),
("pull","jalar"),("push","empujar"),("throw","lanzar"),("catch","atrapar"),
("hit","golpear"),("kick","patear"),("tear","rasgar"),("fold","doblar"),
("wrap","envolver"),("cover","cubrir"),("hide","esconder"),("show","mostrar"),
("point","señalar"),("turn","girar"),("turn on","encender"),("turn off","apagar"),
("mix","mezclar"),("add","agregar"),("remove","quitar"),("fill","llenar"),
("pour","verter"),("press","presionar"),("lift","levantar"),("drop","dejar caer"),
("pick up","recoger"),("set up","instalar/organizar"),
("rise","subir/aumentar"),("fall","caer"),("grow","crecer"),("increase","aumentar"),
("decrease","disminuir"),("change (verb)","cambiar"),("improve","mejorar"),
("succeed","tener éxito"),("fail","fallar"),("compete","competir"),
("practice","practicar"),("prepare","preparar"),("organize","organizar"),
("arrange","arreglar/organizar"),("collect","coleccionar"),("gather","reunir"),
("separate","separar"),("connect","conectar"),("disconnect","desconectar"),
("join","unirse"),("enter","entrar"),("exit","salir"),
("idea","idea"),("opinion","opinión"),("decision","decisión"),("solution","solución"),
("problem","problema"),("reason","razón"),("result","resultado"),("effect","efecto"),
("cause","causa"),("example","ejemplo"),("fact","hecho"),("information","información"),
("rule","regla"),("law","ley"),("permission","permiso"),("freedom","libertad"),
("responsibility","responsabilidad"),("duty","deber"),("purpose","propósito"),
("project","proyecto"),("task","tarea (labor)"),("effort","esfuerzo"),
("chance","oportunidad/posibilidad"),("opportunity","oportunidad"),("risk","riesgo"),
("success","éxito"),("failure","fracaso"),("mistake","error"),
("experience","experiencia"),("knowledge","conocimiento"),("skill","habilidad"),
("ability","capacidad"),("talent","talento"),("memory","memoria"),
("imagination","imaginación"),("attention","atención"),("focus","concentración"),
("courage","valentía"),("fear","miedo"),("faith","fe"),
("trust","confianza"),("doubt","duda"),("truth","verdad"),
("lie (noun)","mentira"),("secret","secreto"),("agreement","acuerdo"),
("conflict","conflicto"),("peace","paz"),("war","guerra"),
("justice","justicia"),("equality","igualdad"),("value","valor"),
])

# Semana 19 – Los 50 verbos irregulares más frecuentes (base – pasado – participio)
W("Semana 19 – Verbos irregulares esenciales (base – pasado – participio)", [
("go – went – gone","ir"),("see – saw – seen","ver"),("eat – ate – eaten","comer"),
("drink – drank – drunk","beber"),("come – came – come","venir"),("take – took – taken","tomar"),
("give – gave – given","dar"),("make – made – made","hacer/fabricar"),("get – got – gotten","obtener"),
("say – said – said","decir"),("know – knew – known","saber/conocer"),("think – thought – thought","pensar"),
("find – found – found","encontrar"),("tell – told – told","contar/decir"),("become – became – become","convertirse"),
("leave – left – left","irse/dejar"),("feel – felt – felt","sentir"),("bring – brought – brought","traer"),
("begin – began – begun","comenzar"),("keep – kept – kept","mantener"),("hold – held – held","sostener"),
("write – wrote – written","escribir"),("stand – stood – stood","pararse"),("hear – heard – heard","oír"),
("let – let – let","permitir"),("mean – meant – meant","significar"),("meet – met – met","conocer/encontrarse"),
("pay – paid – paid","pagar"),("run – ran – run","correr"),("sit – sat – sat","sentarse"),
("speak – spoke – spoken","hablar"),("read – read – read","leer"),("grow – grew – grown","crecer"),
("lose – lost – lost","perder"),("fall – fell – fallen","caer"),("send – sent – sent","enviar"),
("build – built – built","construir"),("understand – understood – understood","entender"),
("break – broke – broken","romper"),("spend – spent – spent","gastar"),("drive – drove – driven","conducir"),
("buy – bought – bought","comprar"),("catch – caught – caught","atrapar"),("teach – taught – taught","enseñar"),
("fly – flew – flown","volar"),("choose – chose – chosen","elegir"),("wear – wore – worn","llevar puesto"),
("sell – sold – sold","vender"),("forget – forgot – forgotten","olvidar"),("put – put – put","poner"),
])

total = sum(len(w["words"]) for w in weeks)

# --- Deduplicar: si una palabra en inglés ya apareció antes, se elimina la repetición
# (se conserva la primera aparición, normalmente en el tema más relevante) ---
import re
def normalize(word):
    w = word.lower()
    w = re.sub(r"\(.*?\)", "", w)      # quita anotaciones entre paréntesis
    w = w.split(" / ")[0].split("/")[0]  # se queda con la primera variante
    return w.strip()

seen = set()
removed = []
for week in weeks:
    unique_words = []
    for eng, spa in week["words"]:
        key = normalize(eng)
        if key in seen:
            removed.append((week["title"], eng))
            continue
        seen.add(key)
        unique_words.append((eng, spa))
    week["words"] = unique_words

print(f"\nPalabras duplicadas eliminadas: {len(removed)}")
for title, eng in removed:
    print(f"  - '{eng}' ya existía antes de: {title}")

total = sum(len(w["words"]) for w in weeks)
print(f"\nTotal final de palabras únicas: {total}")
print("Total de palabras:", total)
for w in weeks:
    print(w["title"], "->", len(w["words"]))

with open("words_a1.json", "w", encoding="utf-8") as f:
    json.dump(weeks, f, ensure_ascii=False, indent=2)


bash

cd /home/claude/plan_ingles && python3 build_words.py 2>&1 | tail -60
Salida

  - 'right (direction)' ya existía antes de: Semana 9 – Clima y lugares de la ciudad
  - 'straight' ya existía antes de: Semana 9 – Clima y lugares de la ciudad
  - 'address (place)' ya existía antes de: Semana 9 – Clima y lugares de la ciudad
  - 'fish (animal)' ya existía antes de: Semana 10 – Animales y naturaleza
  - 'star (sky)' ya existía antes de: Semana 10 – Animales y naturaleza
  - 'waiter / waitress' ya existía antes de: Semana 11 – Profesiones y escuela
  - 'desk (school)' ya existía antes de: Semana 11 – Profesiones y escuela
  - 'degree' ya existía antes de: Semana 11 – Profesiones y escuela
  - 'fly (verb)' ya existía antes de: Semana 12 – Transporte y viajes
  - 'park (verb)' ya existía antes de: Semana 12 – Transporte y viajes
  - 'book (verb)' ya existía antes de: Semana 12 – Transporte y viajes
  - 'happy' ya existía antes de: Semana 13 – Emociones y adjetivos adicionales
  - 'sad' ya existía antes de: Semana 13 – Emociones y adjetivos adicionales
  - 'angry' ya existía antes de: Semana 13 – Emociones y adjetivos adicionales
  - 'before (place/time)' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'what' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'who' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'where' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'when' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'why' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'how' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'which' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'and' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'or' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'but' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'while (conj.)' ya existía antes de: Semana 14 – Preposiciones, palabras de pregunta y conectores
  - 'computer' ya existía antes de: Semana 16 – Tecnología, comunicación y entretenimiento
  - 'mouse (device)' ya existía antes de: Semana 16 – Tecnología, comunicación y entretenimiento
  - 'save (file)' ya existía antes de: Semana 16 – Tecnología, comunicación y entretenimiento
  - 'share (online)' ya existía antes de: Semana 16 – Tecnología, comunicación y entretenimiento
  - 'like (social media)' ya existía antes de: Semana 16 – Tecnología, comunicación y entretenimiento
  - 'tie (game)' ya existía antes de: Semana 16 – Tecnología, comunicación y entretenimiento
  - 'nail (tool)' ya existía antes de: Semana 17 – Herramientas, cantidades, dinero y salud
  - 'glass (material)' ya existía antes de: Semana 17 – Herramientas, cantidades, dinero y salud
  - 'bill (money)' ya existía antes de: Semana 17 – Herramientas, cantidades, dinero y salud
  - 'cold (illness)' ya existía antes de: Semana 17 – Herramientas, cantidades, dinero y salud
  - 'patient (person)' ya existía antes de: Semana 17 – Herramientas, cantidades, dinero y salud
  - 'change (verb)' ya existía antes de: Semana 18 – Verbos de acción, ideas y repaso general

Total final de palabras únicas: 1483
Total de palabras: 1483
Semana 1 – Pronombres, verbos SER/ESTAR/TENER/HACER y saludos -> 96
Semana 2 – Números, días, meses y expresiones de tiempo -> 87
Semana 3 – Familia y personas -> 90
Semana 4 – Colores, formas y adjetivos básicos -> 87
Semana 5 – La casa y los muebles -> 80
Semana 6 – Comida y bebidas -> 71
Semana 7 – Ropa y cuerpo -> 75
Semana 8 – Verbos de la rutina diaria -> 85
Semana 9 – Clima y lugares de la ciudad -> 66
Semana 10 – Animales y naturaleza -> 78
Semana 11 – Profesiones y escuela -> 65
Semana 12 – Transporte y viajes -> 72
Semana 13 – Emociones y adjetivos adicionales -> 59
Semana 14 – Preposiciones, palabras de pregunta y conectores -> 53
Semana 15 – Adverbios comunes y verbos extra (repaso final) -> 62
Semana 16 – Tecnología, comunicación y entretenimiento -> 100
Semana 17 – Herramientas, cantidades, dinero y salud -> 104
Semana 18 – Verbos de acción, ideas y repaso general -> 103
Semana 19 – Verbos irregulares esenciales (base – pasado – participio) -> 50
Investigating a deduplication bug in matching logic.

Weighing homograph duplicates against vocabulary coverage.

Recounting weekly totals to reconcile the mismatch.

Building an A2 vocabulary list across shopping topics.

Drafting travel and office vocabulary for the next weeks.

Compiling health, narrative, and opinion vocabulary sets.

Adding weather, education, and relationship vocabulary sets.

Build words a2 · PY

import json, re

with open("words_a1.json", encoding="utf-8") as f:
    a1_weeks = json.load(f)

def normalize(word):
    w = word.lower()
    w = re.sub(r"\(.*?\)", "", w)
    w = re.sub(r"–.*", "", w)  # verbos irregulares "go – went – gone" -> "go "
    w = w.split(" / ")[0].split("/")[0]
    return w.strip()

a1_set = set()
for wk in a1_weeks:
    for eng, spa in wk["words"]:
        a1_set.add(normalize(eng))

weeks = []
def W(title, pairs):
    weeks.append({"title": title, "words": pairs})

W("A2 · Semana 1 – Compras y devoluciones", [
("refund","reembolso"),("exchange (product)","cambio (producto)"),("return (product)","devolución"),
("warranty","garantía"),("guarantee","garantía (verbo/promesa)"),("complaint","queja"),
("customer service","servicio al cliente"),("fitting room","probador"),("try on","probarse (ropa)"),
("barcode","código de barras"),("discount code","código de descuento"),("clearance","liquidación"),
("bargain","ganga"),("brand new","totalmente nuevo"),("secondhand","de segunda mano"),
("quality control","control de calidad"),("damaged","dañado"),("broken (thing)","roto"),
("defective","defectuoso"),("missing part","pieza faltante"),("instructions manual","manual de instrucciones"),
("assemble","ensamblar"),("gift receipt","recibo de regalo"),("loyalty card","tarjeta de fidelidad"),
("membership","membresía"),("catalog","catálogo"),("order online","pedir en línea"),
("shipping","envío"),("delivery","entrega"),("package / parcel","paquete"),
("tracking number","número de rastreo"),("courier","mensajero"),("express delivery","envío exprés"),
("standard delivery","envío estándar"),("out of stock","agotado"),("in stock","en existencia"),
("available","disponible"),("unavailable","no disponible"),("color option","opción de color"),
("model (product)","modelo (producto)"),("version","versión"),("upgrade","mejora/actualización"),
("downgrade","reducir (plan/versión)"),("subscription","suscripción"),("cancel","cancelar"),
("renew","renovar"),("invoice","factura"),("payment method","método de pago"),
("installment","cuota/pago a plazos"),("negotiate","negociar"),("haggle","regatear"),
("overpriced","sobrevalorado"),("affordable","asequible"),("worth it","que vale la pena"),
("satisfied","satisfecho"),("dissatisfied","insatisfecho"),("store credit","crédito de tienda"),
("gift card","tarjeta de regalo"),("coupon","cupón"),("promo code","código promocional"),
("limited offer","oferta limitada"),("best seller","más vendido"),("customer review","reseña de cliente"),
("rating","calificación"),("feedback","retroalimentación"),
])

W("A2 · Semana 2 – Viajes: aeropuerto, hotel y emergencias", [
("check-in","registro de entrada"),("check-out","salida (hotel)"),("room service","servicio a la habitación"),
("single room","habitación individual"),("double room","habitación doble"),("suite","suite"),
("lobby","vestíbulo"),("concierge","conserje"),("housekeeping","limpieza (hotel)"),
("do not disturb","no molestar"),("key card","tarjeta llave"),("wake-up call","llamada para despertar"),
("mini bar","minibar"),("complimentary","gratuito/cortesía"),("amenities","comodidades"),
("spa","spa"),("laundry service","servicio de lavandería"),("front desk","recepción"),
("overbooked","con sobreventa"),("cancellation","cancelación"),("non-refundable","no reembolsable"),
("itinerary","itinerario"),("layover","escala"),("connecting flight","vuelo de conexión"),
("delayed flight","vuelo retrasado"),("cancelled flight","vuelo cancelado"),("boarding time","hora de embarque"),
("overhead bin","compartimento superior"),("carry-on","equipaje de mano"),("baggage claim","reclamo de equipaje"),
("lost luggage","equipaje perdido"),("customs declaration","declaración de aduana"),("duty-free","libre de impuestos"),
("embassy","embajada"),("consulate","consulado"),("emergency exit","salida de emergencia"),
("fire alarm","alarma de incendio"),("first aid","primeros auxilios"),("evacuation","evacuación"),
("emergency contact","contacto de emergencia"),("insurance claim","reclamo de seguro"),("stolen","robado"),
("robbery","robo"),("pickpocket","carterista"),("police report","reporte policial"),
("lost and found","objetos perdidos"),("replacement passport","pasaporte de reemplazo"),
("travel advisory","advertencia de viaje"),("vaccination certificate","certificado de vacunación"),
("jet lag","descompensación horaria"),("time zone","zona horaria"),("local currency","moneda local"),
("tipping","dar propina"),("guided tour","tour guiado"),("sightseeing","hacer turismo"),
("landmark","punto de referencia/monumento"),
])

W("A2 · Semana 3 – Trabajo y oficina", [
("resume / CV","currículum"),("cover letter","carta de presentación"),("job interview","entrevista de trabajo"),
("job offer","oferta de trabajo"),("position","puesto"),("department","departamento"),
("colleague","colega"),("supervisor","supervisor"),("deadline","fecha límite"),
("meeting room","sala de reuniones"),("conference call","llamada de conferencia"),("presentation","presentación"),
("agenda","agenda/orden del día"),("minutes (meeting)","acta (de reunión)"),("memo","memorando"),
("report","informe"),("spreadsheet","hoja de cálculo"),("attachment","archivo adjunto"),
("reply","responder"),("forward (email)","reenviar"),("inbox","bandeja de entrada"),
("out of office","fuera de la oficina"),("sick leave","permiso por enfermedad"),("vacation days","días de vacaciones"),
("overtime","horas extra"),("part-time","medio tiempo"),("full-time","tiempo completo"),
("remote work","trabajo remoto"),("freelance","trabajo independiente"),("promotion","ascenso"),
("raise (salary)","aumento de sueldo"),("resign","renunciar"),("lay off","despedir (recorte)"),
("retire","jubilarse"),("teamwork","trabajo en equipo"),("brainstorm","lluvia de ideas"),
("performance review","evaluación de desempeño"),("workload","carga de trabajo"),("multitask","hacer varias cosas a la vez"),
("prioritize","priorizar"),("negotiation","negociación"),("client","cliente (negocio)"),
("stakeholder","parte interesada"),("quarterly","trimestral"),("annual","anual"),
("target (goal)","meta"),("achieve","lograr"),("accomplish","cumplir/lograr"),
("project manager","gerente de proyecto"),("human resources","recursos humanos"),("headquarters","sede central"),
("branch office","sucursal"),("shift (work)","turno"),("commute","desplazarse al trabajo"),
("paperwork","papeleo"),("signature","firma"),("approval","aprobación"),
("policy (company)","política (empresa)"),("training","capacitación"),("onboarding","proceso de incorporación"),
("networking event","evento de networking"),
])

W("A2 · Semana 4 – Salud y cuerpo (síntomas y citas médicas)", [
("symptom","síntoma"),("diagnosis","diagnóstico"),("prescription","receta médica"),
("dosage","dosis"),("side effect","efecto secundario"),("allergy","alergia"),
("allergic reaction","reacción alérgica"),("infection","infección"),("inflammation","inflamación"),
("rash","sarpullido"),("swelling","hinchazón"),("bruise","moretón"),
("wound","herida"),("stitches","puntos de sutura"),("cast (medical)","yeso"),
("crutches","muletas"),("wheelchair","silla de ruedas"),("blood pressure","presión arterial"),
("heart rate","ritmo cardíaco"),("pulse","pulso"),("x-ray","radiografía"),
("surgery / operation","cirugía"),("anesthesia","anestesia"),("recovery","recuperación"),
("checkup","chequeo médico"),("specialist","especialista"),("physical therapy","fisioterapia"),
("mental health","salud mental"),("anxiety","ansiedad"),("depression","depresión"),
("sleep disorder","trastorno del sueño"),("chronic","crónico"),("acute","agudo"),
("contagious","contagioso"),("immune system","sistema inmunológico"),("lungs","pulmones"),
("liver","hígado"),("kidney","riñón"),("intestine","intestino"),
("joint","articulación"),("spine","columna vertebral"),("artery","arteria"),
("vein","vena"),("nervous system","sistema nervioso"),("digestive system","sistema digestivo"),
("hormone","hormona"),("metabolism","metabolismo"),("nutrient","nutriente"),
("vitamin","vitamina"),("protein","proteína"),("carbohydrate","carbohidrato"),
("fiber","fibra"),("calorie","caloría"),("overweight","sobrepeso"),
("underweight","bajo peso"),("obesity","obesidad"),("wellness","bienestar"),
("hygiene","higiene"),("first aid kit","botiquín de primeros auxilios"),
])

W("A2 · Semana 5 – Conectores narrativos para contar historias", [
("once upon a time","érase una vez"),("meanwhile","mientras tanto"),("afterward","después/luego"),
("eventually","finalmente/con el tiempo"),("in the end","al final"),("at first","al principio"),
("later on","más adelante"),("as soon as","tan pronto como"),("by the time","para cuando"),
("used to","solía"),("previously","previamente"),("formerly","anteriormente"),
("ever since","desde entonces"),("from then on","desde ese momento"),("at that moment","en ese momento"),
("right after","justo después"),("shortly after","poco después"),("in the meantime","mientras tanto"),
("all of a sudden","de repente"),("little by little","poco a poco"),("one day","un día"),
("years ago","hace años"),("back then","en aquel entonces"),("during that time","durante ese tiempo"),
("at the same time","al mismo tiempo"),("in those days","en aquellos días"),("as a result","como resultado"),
("consequently","en consecuencia"),("thus","así/por lo tanto"),("for this reason","por esta razón"),
("due to","debido a"),("because of","a causa de"),("that's why","por eso"),
("in contrast","en contraste"),("instead","en cambio"),("nevertheless","sin embargo/no obstante"),
("nonetheless","no obstante"),("moreover","además"),("furthermore","además/asimismo"),
("in addition","adicionalmente"),("besides","además"),("apart from","aparte de"),
("in conclusion","en conclusión"),("to sum up","en resumen"),("overall","en general"),
("in general","en general"),("such as","tal como"),("in particular","en particular"),
])

W("A2 · Semana 6 – Expresar opiniones", [
("in my opinion","en mi opinión"),("I believe that","creo que"),("I feel that","siento que"),
("personally","personalmente"),("from my point of view","desde mi punto de vista"),("I agree","estoy de acuerdo"),
("I disagree","no estoy de acuerdo"),("I'm not sure","no estoy seguro"),("it seems to me","me parece que"),
("as far as I know","que yo sepa"),("I suppose","supongo"),("I guess (opinion)","supongo/creo"),
("to be honest","para ser honesto"),("in fact","de hecho"),("definitely","definitivamente"),
("absolutely","absolutamente"),("of course","por supuesto"),("no way","de ninguna manera"),
("that's true","eso es cierto"),("that's not true","eso no es cierto"),("I doubt it","lo dudo"),
("it depends","depende"),("on one hand","por un lado"),("on the other hand","por otro lado"),
("it's obvious","es obvio"),("clearly","claramente"),("apparently","aparentemente"),
("allegedly","supuestamente"),("presumably","presumiblemente"),("undoubtedly","sin duda"),
("arguably","posiblemente/se podría decir"),("in my experience","en mi experiencia"),("based on","basado en"),
("according to","según"),("evidence","evidencia"),("argument","argumento"),
("viewpoint / standpoint","punto de vista"),("counterargument","contraargumento"),("valid point","punto válido"),
("convince","convencer"),("persuade","persuadir"),("debate","debate"),
("controversy","controversia"),("agree to disagree","acordar estar en desacuerdo"),
])

W("A2 · Semana 7 – Clima y desastres naturales", [
("heatwave","ola de calor"),("wildfire","incendio forestal"),("hurricane","huracán"),
("tornado","tornado"),("tsunami","tsunami"),("avalanche","avalancha"),
("landslide","deslizamiento de tierra"),("blizzard","ventisca"),("hailstorm","granizada"),
("thunderstorm","tormenta eléctrica"),("temperature drop","descenso de temperatura"),("climate change","cambio climático"),
("global warming","calentamiento global"),("greenhouse effect","efecto invernadero"),("carbon footprint","huella de carbono"),
("renewable energy","energía renovable"),("deforestation","deforestación"),("extinction","extinción"),
("endangered species","especie en peligro"),("natural disaster","desastre natural"),("shelter (emergency)","refugio"),
("relief effort","esfuerzo de ayuda"),("damage","daño"),("destruction","destrucción"),
("rebuild","reconstruir"),("warning system","sistema de alerta"),("meteorologist","meteorólogo"),
("atmosphere","atmósfera"),("ozone layer","capa de ozono"),("ecosystem","ecosistema"),
("biodiversity","biodiversidad"),("sustainability","sostenibilidad"),("emission","emisión"),
("fossil fuel","combustible fósil"),
])

W("A2 · Semana 8 – Educación y estudios superiores", [
("enroll","inscribirse"),("tuition","matrícula (costo)"),("scholarship","beca"),
("semester","semestre"),("syllabus","programa del curso"),("lecture","clase magistral"),
("seminar","seminario"),("thesis","tesis"),("dissertation","tesis doctoral"),
("major (field of study)","carrera principal"),("minor (field of study)","especialización secundaria"),("GPA","promedio académico"),
("transcript","historial académico"),("diploma","diploma"),("certificate","certificado"),
("campus","campus"),("dormitory","residencia estudiantil"),("faculty","facultad/cuerpo docente"),
("professor","profesor universitario"),("academic advisor","asesor académico"),("plagiarism","plagio"),
("assignment","tarea/trabajo"),("essay","ensayo"),("research paper","trabajo de investigación"),
("citation","cita bibliográfica"),("bibliography","bibliografía"),("peer review","revisión por pares"),
("graduate","graduado"),("undergraduate","estudiante de pregrado"),("postgraduate","posgrado"),
("internship","pasantía"),("apprenticeship","aprendizaje (oficio)"),("vocational training","formación profesional"),
("distance learning","educación a distancia"),("online course","curso en línea"),("tutor","tutor"),
("mentor","mentor"),("extracurricular","extracurricular"),("student loan","préstamo estudiantil"),
("financial aid","ayuda financiera"),("dropout","abandono escolar"),("literacy","alfabetización"),
("curriculum","plan de estudios"),("elective","materia electiva"),("credit hour","hora crédito"),
("exam period","periodo de exámenes"),
])

W("A2 · Semana 9 – Relaciones y emociones complejas", [
("trust issues","problemas de confianza"),("commitment","compromiso"),("breakup","ruptura"),
("reconciliation","reconciliación"),("betrayal","traición"),("forgiveness","perdón"),
("empathy","empatía"),("sympathy","compasión/comprensión"),("compassion","compasión"),
("resentment","resentimiento"),("heartbreak","desamor"),("infatuation","enamoramiento pasajero"),
("attraction","atracción"),("compatibility","compatibilidad"),("conflict resolution","resolución de conflictos"),
("compromise","compromiso/acuerdo"),("mutual respect","respeto mutuo"),("boundaries","límites (emocionales)"),
("codependency","codependencia"),("long-distance relationship","relación a distancia"),("soulmate","alma gemela"),
("companionship","compañerismo"),("intimacy","intimidad"),("vulnerability","vulnerabilidad"),
("self-esteem","autoestima"),("self-doubt","inseguridad/duda de uno mismo"),("insecurity","inseguridad"),
("overwhelmed","abrumado"),("burnout","agotamiento (laboral/emocional)"),("frustration","frustración"),
("irritation","irritación"),("resentful","resentido"),("heartfelt","sincero/de corazón"),
("overjoyed","muy feliz"),("devastated","devastado"),("humiliated","humillado"),
("ashamed","avergonzado"),("guilty","culpable"),("remorse","remordimiento"),
("regret","arrepentimiento"),("longing","anhelo"),("nostalgia","nostalgia"),
("contentment","satisfacción/contento"),("fulfillment","realización personal"),
])

W("A2 · Semana 10 – Tecnología intermedia: redes y seguridad", [
("firewall","cortafuegos"),("antivirus","antivirus"),("malware","malware"),
("phishing","phishing (fraude en línea)"),("hacker","hacker"),("cybersecurity","ciberseguridad"),
("encryption","cifrado"),("two-factor authentication","autenticación de dos factores"),("backup","copia de seguridad"),
("cloud storage","almacenamiento en la nube"),("server","servidor"),("database","base de datos"),
("browser","navegador"),("cookie (internet)","cookie (internet)"),("cache","caché"),
("bandwidth","ancho de banda"),("router","router"),("bluetooth","bluetooth"),
("hotspot","punto de acceso"),("streaming","transmisión en línea"),("notification","notificación"),
("settings","configuración"),("factory reset","restablecer de fábrica"),("screenshot","captura de pantalla"),
("hashtag","hashtag"),("algorithm","algoritmo"),("artificial intelligence","inteligencia artificial"),
("virtual reality","realidad virtual"),("augmented reality","realidad aumentada"),("e-commerce","comercio electrónico"),
("online banking","banca en línea"),("digital signature","firma digital"),("biometric","biométrico"),
("fingerprint scanner","lector de huellas"),("facial recognition","reconocimiento facial"),("smart home","hogar inteligente"),
("wearable device","dispositivo portátil"),("drone","dron"),("3D printing","impresión 3D"),
])

W("A2 · Semana 11 – Cocina y recetas", [
("recipe","receta"),("ingredient","ingrediente"),("chop","picar"),("slice","cortar en rodajas"),
("grate","rallar"),("peel","pelar"),("whisk","batir"),("stir","revolver"),
("boil","hervir"),("simmer","cocinar a fuego lento"),("roast","asar (horno)"),("grill","asar a la parrilla"),
("bake","hornear"),("fry","freír"),("steam","cocinar al vapor"),("marinate","marinar"),
("season (food)","sazonar"),("garnish","decorar (plato)"),("portion","porción"),("serving","porción/ración"),
("leftovers","sobras"),("preheat","precalentar"),("blend","licuar"),("mash","triturar/hacer puré"),
("dice","cortar en cubos"),("sprinkle","espolvorear"),("drizzle","rociar (líquido)"),("sauce","salsa"),
("broth / stock","caldo"),("dough","masa"),("batter","masa líquida"),("yeast","levadura"),
("flour","harina"),("baking powder","polvo de hornear"),("vanilla","vainilla"),("cinnamon","canela"),
("herbs","hierbas"),("spices","especias"),("recipe book / cookbook","libro de cocina"),("nutrition label","etiqueta nutricional"),
("expiration date","fecha de caducidad"),("organic","orgánico"),("homemade","casero"),("store-bought","comprado en tienda"),
("vegetarian","vegetariano"),("vegan","vegano"),("gluten-free","sin gluten"),("dairy-free","sin lácteos"),
("food processor","procesador de alimentos"),("blender","licuadora"),("mixing bowl","tazón para mezclar"),
("cutting board","tabla de cortar"),("measuring cup","taza medidora"),("colander","colador"),
("apron","delantal"),("recipe card","tarjeta de receta"),("side dish","guarnición"),("main course","plato principal"),
("appetizer","aperitivo"),("dessert","postre"),
])

W("A2 · Semana 12 – Mantenimiento del hogar y reparaciones", [
("repair","reparar"),("leak","fuga"),("clog","atascar/atasco"),("broken pipe","tubería rota"),
("renovate","renovar"),("remodel","remodelar"),("DIY (do it yourself)","hazlo tú mismo"),("blueprint","plano"),
("contractor","contratista"),("handyman","manitas/reparador"),("maintenance","mantenimiento"),("inspection","inspección"),
("electrical outlet","tomacorriente"),("circuit breaker","interruptor automático"),("fuse","fusible"),("wiring","cableado"),
("plumbing","plomería"),("drain","desagüe"),("faucet / tap","grifo"),("thermostat","termostato"),
("insulation","aislamiento"),("ventilation","ventilación"),("mold","moho"),("pest control","control de plagas"),
("termite","termita"),("rust","óxido"),("crack (wall)","grieta"),("dent","abolladura"),
("scratch","rayón"),("stain","mancha"),("paint roller","rodillo de pintura"),("sandpaper","papel de lija"),
("nail gun","pistola de clavos"),("power drill","taladro eléctrico"),("toolbox","caja de herramientas"),
("measuring tape","cinta métrica"),("level (tool)","nivel (herramienta)"),("wrench","llave inglesa"),
("pliers","alicates"),("safety goggles","gafas de seguridad"),("gloves (work)","guantes de trabajo"),
("warranty (repair)","garantía (reparación)"),("estimate (cost)","presupuesto/estimado"),("quote (price)","cotización"),
("appliance repair","reparación de electrodomésticos"),("gutter","canaleta"),("chimney","chimenea"),
("foundation (house)","cimientos"),("structural damage","daño estructural"),("home inspection","inspección de vivienda"),
("upgrade (home)","mejora del hogar"),("recyclable","reciclable"),("waste disposal","eliminación de residuos"),
])

W("A2 · Semana 13 – Deportes y vida activa", [
("tournament","torneo"),("league","liga"),("season (sports)","temporada (deportiva)"),("teammate","compañero de equipo"),
("opponent","oponente"),("warm-up","calentamiento"),("stretch","estirar"),("stamina","resistencia"),
("cardio","cardio"),("strength training","entrenamiento de fuerza"),("personal trainer","entrenador personal"),("workout","rutina de ejercicio"),
("set (exercise)","serie (ejercicio)"),("rep / repetition","repetición"),("marathon","maratón"),("sprint","carrera corta/esprintar"),
("finish line","línea de meta"),("medal","medalla"),("trophy","trofeo"),("record (sports)","récord"),
("draw (tie)","empate"),("penalty","penalti"),("foul","falta"),("injury time","tiempo de descuento"),
("substitute (player)","suplente"),("captain (team)","capitán (equipo)"),("spectator","espectador"),("fan (sports)","aficionado"),
("scoreboard","marcador"),("halftime","medio tiempo"),("overtime (sports)","tiempo extra"),("locker room","vestuario"),
("equipment (sports)","equipo (deportivo)"),("helmet","casco"),("mat (exercise)","colchoneta"),("treadmill","cinta de correr"),
("dumbbell","mancuerna"),("flexibility","flexibilidad"),("endurance","resistencia (física)"),("posture","postura"),
("physical fitness","aptitud física"),("recreational","recreativo"),("outdoor activity","actividad al aire libre"),("adventure sport","deporte de aventura"),
])

W("A2 · Semana 14 – Cultura, medios y entretenimiento", [
("headline","titular"),("breaking news","noticia de última hora"),("editorial","editorial"),("celebrity","celebridad"),
("plot (story)","trama"),("character (story)","personaje"),("genre","género"),("soundtrack","banda sonora"),
("subtitle","subtítulo"),("box office","taquilla"),("streaming platform","plataforma de streaming"),("premiere","estreno"),
("sequel","secuela"),("remake","nueva versión"),("script","guion"),("director","director"),
("producer","productor"),("cast (movie)","reparto"),("audience","audiencia"),("review (critique)","crítica/reseña"),
("critic","crítico"),("bestselling","más vendido (libro)"),("author","autor"),("publisher","editorial (empresa)"),
("edition","edición"),("chapter","capítulo"),("plot twist","giro de la trama"),("cliffhanger","final en suspenso"),
("fan base","base de fanáticos"),("influencer","influencer"),("viral","viral"),("trending","en tendencia"),
("content creator","creador de contenido"),("live stream","transmisión en vivo"),("podcast","podcast"),("episode (podcast)","episodio (podcast)"),
("exhibit / exhibition","exhibición"),("gallery","galería"),("performance (show)","actuación"),("stand-up comedy","comedia en vivo"),
("orchestra","orquesta"),("choir","coro"),("album","álbum"),("lyrics","letra de canción"),
])

W("A2 · Semana 15 – Personalidad y carácter", [
("ambitious","ambicioso"),("stubborn","terco"),("arrogant","arrogante"),("humble","humilde"),
("reliable","confiable"),("trustworthy","digno de confianza"),("sociable","sociable"),("introverted","introvertido"),
("extroverted","extrovertido"),("open-minded","de mente abierta"),("closed-minded","cerrado de mente"),("judgmental","crítico/juzgón"),
("optimistic","optimista"),("pessimistic","pesimista"),("realistic","realista"),("idealistic","idealista"),
("assertive","asertivo"),("passive","pasivo"),("aggressive","agresivo"),("competitive","competitivo"),
("cooperative","cooperativo"),("independent","independiente"),("dependent","dependiente"),("mature","maduro"),
("immature","inmaduro"),("responsible","responsable"),("irresponsible","irresponsable"),("disciplined","disciplinado"),
("spontaneous","espontáneo"),("cautious","cauteloso"),("adventurous","aventurero"),("creative","creativo"),
("logical","lógico"),("analytical","analítico"),("intuitive","intuitivo"),("perceptive","perceptivo"),
("charismatic","carismático"),("witty","ingenioso"),("sarcastic","sarcástico"),("blunt","directo/franco"),
("diplomatic","diplomático"),("tactful","con tacto"),("insensitive","insensible"),("thoughtful","considerado"),
("forgetful","olvidadizo"),("punctual","puntual"),("easygoing","de trato fácil"),("demanding","exigente"),
])

# --- Deduplicar dentro de A2 y contra A1 ---
seen = set(a1_set)
removed = []
for week in weeks:
    unique = []
    for eng, spa in week["words"]:
        key = normalize(eng)
        if key in seen:
            removed.append((week["title"], eng))
            continue
        seen.add(key)
        unique.append((eng, spa))
    week["words"] = unique

print(f"Palabras de A2 eliminadas por duplicar A1 o repetirse: {len(removed)}")
for title, eng in removed:
    print(f"  - '{eng}' ({title})")

total = sum(len(w["words"]) for w in weeks)
print(f"\nTotal de palabras únicas nuevas en A2: {total}")
for w in weeks:
    print(w["title"], "->", len(w["words"]))

with open("words_a2.json", "w", encoding="utf-8") as f:
    json.dump(weeks, f, ensure_ascii=False, indent=2)

bash

cd /home/claude/plan_ingles && python3 build_words_a2.py 2>&1 | tail -30
Salida

Palabras de A2 eliminadas por duplicar A1 o repetirse: 1
  - 'try on' (A2 · Semana 1 – Compras y devoluciones)

Total de palabras únicas nuevas en A2: 495
A2 · Semana 1 – Compras y devoluciones -> 64
A2 · Semana 2 – Viajes: aeropuerto, hotel y emergencias -> 56
A2 · Semana 3 – Trabajo y oficina -> 61
A2 · Semana 4 – Salud y cuerpo (síntomas y citas médicas) -> 59
A2 · Semana 5 – Conectores narrativos para contar historias -> 48
A2 · Semana 6 – Expresar opiniones -> 44
A2 · Semana 7 – Clima y desastres naturales -> 34
A2 · Semana 8 – Educación y estudios superiores -> 46
A2 · Semana 9 – Relaciones y emociones complejas -> 44
A2 · Semana 10 – Tecnología intermedia: redes y seguridad -> 39

Debugging a normalization function causing false duplicate matches.

Planificando semanas adicionales para alcanzar el total deseado.

Build doc · JS

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, PageBreak, LevelFormat,
  convertInchesToTwip
} = require("docx");

const weeks = JSON.parse(fs.readFileSync("words_a1.json", "utf-8"));
const weeksA2 = JSON.parse(fs.readFileSync("words_a2.json", "utf-8"));
const samples = JSON.parse(fs.readFileSync("sample_paragraphs.json", "utf-8"));
const totalA1 = weeks.reduce((s, w) => s + w.words.length, 0);
const totalA2 = weeksA2.reduce((s, w) => s + w.words.length, 0);

const NAVY = "1F3864";
const GOLD = "B08D57";
const GRAY = "595959";
const LIGHT = "F2F2F2";

const PAGE_WIDTH_DXA = 12240; // US Letter
const PAGE_HEIGHT_DXA = 15840;
const MARGIN = convertInchesToTwip(0.9);
const USABLE_WIDTH = PAGE_WIDTH_DXA - 2 * MARGIN;

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { color: GOLD, space: 4, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 26 })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 150, line: 300 },
    children: [new TextRun({ text, size: 22, color: "262626", ...opts })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 90 },
    children: [new TextRun({ text, size: 22, color: "262626" })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function cell(text, opts = {}) {
  const { width, bold = false, color = "262626", shading = null, align = AlignmentType.LEFT, size = 20 } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shading ? { type: ShadingType.CLEAR, fill: shading } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, size })],
    })],
  });
}

function buildWordBankTable(pairs) {
  const w1 = 2412, w2 = 2412, w3 = 2412, w4 = 2412;
  const rows = [];
  rows.push(new TableRow({ tableHeader: true, children: [
    cell("Inglés", { width: w1, bold: true, color: "FFFFFF", shading: NAVY }),
    cell("Español", { width: w2, bold: true, color: "FFFFFF", shading: NAVY }),
    cell("Inglés", { width: w3, bold: true, color: "FFFFFF", shading: NAVY }),
    cell("Español", { width: w4, bold: true, color: "FFFFFF", shading: NAVY }),
  ]}));
  const half = Math.ceil(pairs.length / 2);
  for (let i = 0; i < half; i++) {
    const left = pairs[i];
    const right = pairs[i + half];
    const shading = i % 2 === 0 ? "FFFFFF" : LIGHT;
    rows.push(new TableRow({ children: [
      cell(left ? left[0] : "", { width: w1, shading }),
      cell(left ? left[1] : "", { width: w2, shading }),
      cell(right ? right[0] : "", { width: w3, shading }),
      cell(right ? right[1] : "", { width: w4, shading }),
    ]}));
  }
  return new Table({ width: { size: w1+w2+w3+w4, type: WidthType.DXA }, columnWidths: [w1,w2,w3,w4], rows });
}

// ---------- PORTADA ----------
const cover = [
  new Paragraph({ spacing: { before: 2000 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "PLAN DE ESTUDIO DE INGLÉS", bold: true, size: 56, color: NAVY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: "Método progresivo por vocabulario: A1 → A2 → B1 → B2", size: 28, color: GOLD, bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [new TextRun({ text: "Banco de vocabulario de A1 y A2 (~2.200 palabras), calendario de estudio,", size: 22, color: GRAY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "plantilla de tarjetas Anki y guía de progresión hacia A2, B1 y B2", size: 22, color: GRAY })],
  }),
  new Paragraph({ spacing: { before: 1500 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Documento de trabajo personal — se actualiza según tu progreso", italics: true, size: 20, color: GRAY })],
  }),
  pageBreak(),
];

// ---------- INTRODUCCIÓN ----------
const intro = [
  h1("1. Cómo funciona este método"),
  p("Este plan está construido sobre una idea simple: el inglés que necesitas para leer y traducir textos depende, sobre todo, de cuántas de las palabras más frecuentes del idioma reconoces. No hace falta memorizar el diccionario completo — el 80% de cualquier texto común está formado por menos de 1.000 palabras distintas."),
  p("Por eso, en vez de estudiar gramática de forma aislada, vas a construir un banco de vocabulario por niveles y vas a usarlo inmediatamente para leer párrafos reales. Cuando puedas leer y entender los párrafos de un nivel sin esfuerzo, subes al siguiente."),
  h2("Ritmo de trabajo"),
  p("No hay prisa. Está bien tardar de 3 a 4 meses en el nivel A1 — lo importante es la constancia, no la velocidad. Este documento asume un ritmo de aproximadamente 90-110 palabras nuevas por semana, con repaso diario."),
  h2("Estructura del documento"),
  bullet("Sección 2: cómo usar la repetición espaciada (Anki) — tu \"motor\" de memorización."),
  bullet("Sección 3: calendario general de 4 niveles (A1 → A2 → B1 → B2)."),
  bullet(`Sección 4: el banco completo de ${totalA1} palabras de A1, dividido en ${weeks.length} semanas temáticas.`),
  bullet("Sección 5: cómo pasar de A1 a A2 — ejemplos de párrafos de cada nivel."),
  bullet(`Sección 6: el banco completo de ${totalA2} palabras nuevas de A2, dividido en ${weeksA2.length} semanas temáticas.`),
  bullet("Sección 7: cómo seguir hacia B1 y B2 una vez domines A1-A2 (el banco de B1 llega en la próxima actualización)."),
  bullet("Sección 8: criterios claros para saber cuándo avanzar de nivel."),
];

// ---------- ANKI ----------
const ankiWidths = [1800, 5220, 2400];
const ankiTable = new Table({
  width: { size: ankiWidths.reduce((a,b)=>a+b,0), type: WidthType.DXA },
  columnWidths: ankiWidths,
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        cell("Campo", { width: ankiWidths[0], bold: true, color: "FFFFFF", shading: NAVY }),
        cell("Qué escribir", { width: ankiWidths[1], bold: true, color: "FFFFFF", shading: NAVY }),
        cell("Ejemplo", { width: ankiWidths[2], bold: true, color: "FFFFFF", shading: NAVY }),
      ],
    }),
    new TableRow({ children: [
      cell("Front (frente)", { width: ankiWidths[0], shading: LIGHT }),
      cell("La palabra en inglés, sola.", { width: ankiWidths[1] }),
      cell("kitchen", { width: ankiWidths[2] }),
    ]}),
    new TableRow({ children: [
      cell("Back (reverso)", { width: ankiWidths[0], shading: LIGHT }),
      cell("La traducción al español.", { width: ankiWidths[1] }),
      cell("cocina", { width: ankiWidths[2] }),
    ]}),
    new TableRow({ children: [
      cell("Example (ejemplo)", { width: ankiWidths[0], shading: LIGHT }),
      cell("Una frase corta y sencilla que tú mismo escribas usando la palabra.", { width: ankiWidths[1] }),
      cell("The kitchen is small.", { width: ankiWidths[2] }),
    ]}),
    new TableRow({ children: [
      cell("Tag (etiqueta)", { width: ankiWidths[0], shading: LIGHT }),
      cell("El nivel y la semana, para poder filtrar después.", { width: ankiWidths[1] }),
      cell("A1_semana5", { width: ankiWidths[2] }),
    ]}),
  ],
});

const anki = [
  h1("2. Plantilla de tarjetas para Anki (o Quizlet)"),
  p("Anki es una app gratuita (Windows, Mac, Android; en iOS tiene un costo) que usa repetición espaciada: te muestra cada palabra justo antes de que la olvides. Si prefieres algo más simple y visual, Quizlet funciona igual de bien para este plan."),
  h2("Estructura de cada tarjeta"),
  ankiTable,
  new Paragraph({ spacing: { before: 200 }, children: [] }),
  h2("Reglas de uso"),
  bullet("Crea un mazo (deck) por nivel: \"Inglés A1\", \"Inglés A2\", etc."),
  bullet("Añade las palabras de la semana en bloques de 15-20 por sesión, no las 100 de golpe."),
  bullet("Repasa TODOS los días, aunque sea 10 minutos — es más importante la frecuencia que la duración."),
  bullet("Cuando una tarjeta te resulte \"demasiado fácil\" muchas veces seguidas, Anki espaciará su repaso automáticamente. Confía en el algoritmo."),
  bullet("Escribe tú mismo la frase de ejemplo (no la copies) — el esfuerzo de producir la frase es lo que fija la palabra en la memoria."),
];

// ---------- CALENDARIO ----------
const calWidths = [1500, 2200, 3200, 2520];
function calRow(nivel, duracion, foco, meta, header=false) {
  const shading = header ? NAVY : null;
  const color = header ? "FFFFFF" : "262626";
  const bold = header;
  return new TableRow({ tableHeader: header, children: [
    cell(nivel, { width: calWidths[0], bold, color, shading: shading || LIGHT }),
    cell(duracion, { width: calWidths[1], bold, color, shading }),
    cell(foco, { width: calWidths[2], bold, color, shading }),
    cell(meta, { width: calWidths[3], bold, color, shading }),
  ]});
}
const calTable = new Table({
  width: { size: calWidths.reduce((a,b)=>a+b,0), type: WidthType.DXA },
  columnWidths: calWidths,
  rows: [
    calRow("Nivel", "Duración estimada", "Foco principal", "Meta de vocabulario", true),
    calRow("A1", `3-4 meses (${weeks.length} semanas)`, "Vocabulario básico + lectura de frases cortas", `${totalA1} palabras (banco de este documento)`),
    calRow("A2", `3-4 meses (${weeksA2.length} semanas)`, "Vocabulario ampliado + párrafos cortos de la vida diaria", `+${totalA2} palabras (total ~${totalA1+totalA2})`),
    calRow("B1", "4-6 meses", "Vocabulario temático + textos de opinión y noticias simples (próxima entrega)", "+800-1.000 palabras estimadas"),
    calRow("B2", "6-9 meses", "Vocabulario abstracto/técnico + artículos y ficción moderna (próxima entrega)", "+1.500-2.000 palabras estimadas"),
  ],
});

const calendario = [
  h1("3. Calendario general (A1 → B2)"),
  p("Este es un mapa de referencia, no una obligación estricta. Ajusta los tiempos a tu disponibilidad real; lo que importa es no saltarte niveles."),
  calTable,
  new Paragraph({ spacing: { before: 250 }, children: [] }),
  p("Nota sobre el ritmo: si dedicas 30-45 minutos diarios, 3-4 meses para A1 es un cálculo realista y cómodo. Si solo puedes dedicar 15 minutos algunos días, simplemente estira el calendario — no te saltes repasos para \"ir más rápido\"."),
];

// ---------- SECCIÓN 4: BANCO DE PALABRAS A1 ----------
const bankIntro = [
  h1(`4. Banco de vocabulario A1 (${weeks.length} semanas, ${totalA1} palabras)`),
  p("Cada semana tiene un tema para que las palabras se refuercen entre sí (más fácil recordar \"kitchen, table, chair\" juntas que sueltas). Sigue el orden si eres principiante total; si ya conoces algunas palabras, sáltalas y sigue avanzando."),
  p("Sugerencia de uso semanal: día 1-2 introduces las palabras en Anki, día 3-5 repasas y lees el mini-párrafo de repaso de la sección 5, día 6-7 repaso general y descanso si lo necesitas."),
  p("Nota: las palabras que se repetían entre semanas (por ejemplo \"happy\" en la semana de adjetivos y en la de emociones) se dejaron una sola vez, en el tema donde tiene más sentido aprenderlas. La última semana (19) reúne los 50 verbos irregulares más frecuentes con sus tres formas — son los que más confusión causan al leer, así que trátalos como tarjetas propias en Anki."),
];

const wordSections = [];
weeks.forEach((week) => {
  wordSections.push(h2(`${week.title}  (${week.words.length} palabras)`));
  wordSections.push(buildWordBankTable(week.words));
  wordSections.push(new Paragraph({ spacing: { after: 250 }, children: [] }));
});

// ---------- SECCIÓN 5: A1 -> A2 ----------
const a1toa2 = [
  h1("5. De A1 a A2: perfeccionar leyendo párrafos"),
  p("Una vez completas las 19 semanas del banco A1, no pases inmediatamente a memorizar más palabras. Primero, usa el vocabulario que ya tienes para leer párrafos completos hasta que los entiendas sin traducir mentalmente cada palabra."),
  h2("Ejemplo de párrafo de nivel A1"),
  new Paragraph({
    spacing: { after: 150, line: 300 },
    shading: { type: ShadingType.CLEAR, fill: LIGHT },
    children: [new TextRun({ text: samples.a1, italics: true, size: 22, color: "262626" })],
  }),
  p("Practica así: lee el párrafo completo una vez sin buscar nada. Luego subraya las palabras que no reconozcas, búscalas y agrégalas a Anki. Vuelve a leer el párrafo hasta que lo entiendas de corrido. Repite con 2-3 párrafos similares por semana (puedes pedir a un generador de texto o buscar \"graded readers A1\" para conseguir más)."),
  h2("Ejemplo de párrafo de nivel A2"),
  new Paragraph({
    spacing: { after: 150, line: 300 },
    shading: { type: ShadingType.CLEAR, fill: LIGHT },
    children: [new TextRun({ text: samples.a2, italics: true, size: 22, color: "262626" })],
  }),
  p("La diferencia con A1: frases más largas, conectores (\"so\", \"before\", \"when\"), y narración de eventos pasados. Cuando puedas leer 4-5 párrafos como este sin diccionario, sigue con el banco completo de A2 de la siguiente sección."),
];

// ---------- SECCIÓN 6: BANCO DE PALABRAS A2 ----------
const bankA2Intro = [
  h1(`6. Banco de vocabulario A2 (${weeksA2.length} semanas, ${totalA2} palabras nuevas)`),
  p("Este banco ya no cubre supervivencia básica, sino situaciones específicas de la vida diaria: comprar y devolver productos, viajar con imprevistos, trabajar en una oficina, ir al médico, opinar, y más. Ninguna de estas palabras se repite con el banco de A1 — se revisaron para evitar duplicados."),
  p("Sigue el mismo sistema: 15-20 palabras nuevas por sesión en Anki, repaso diario, y en cuanto termines cada semana, intenta leer o escribir un párrafo corto usando esas palabras en contexto."),
];
const wordSectionsA2 = [];
weeksA2.forEach((week) => {
  wordSectionsA2.push(h2(`${week.title}  (${week.words.length} palabras)`));
  wordSectionsA2.push(buildWordBankTable(week.words));
  wordSectionsA2.push(new Paragraph({ spacing: { after: 250 }, children: [] }));
});

// ---------- SECCIÓN 7: HACIA B1 y B2 ----------
const b1b2 = [
  h1("7. Hacia B1 y B2: el mismo método, un escalón más arriba"),
  h2("B1 (+800-1.000 palabras adicionales)"),
  p("En B1 el vocabulario se vuelve más temático y menos \"de supervivencia\". Construye listas nuevas (mismo formato de tabla, mismo sistema de Anki) sobre:"),
  bullet("Noticias y actualidad (economía básica, medio ambiente, tecnología, salud pública)."),
  bullet("Opiniones y argumentación (expresar acuerdo, comparar ventajas y desventajas, dar razones)."),
  bullet("Vocabulario académico general (analizar, resumir, concluir, según, por lo tanto)."),
  p("La práctica de lectura cambia: en vez de párrafos de 5-6 líneas, lee artículos cortos completos (noticias simplificadas de sitios como \"News in Levels\" o \"BBC Learning English\") y trata de resumir la idea principal en tus propias palabras, en inglés."),
  h2("B2 (+1.500-2.000 palabras adicionales)"),
  p("En B2 empiezas a incorporar vocabulario abstracto y de registro más formal o técnico según tus intereses (trabajo, estudios, aficiones específicas). Aquí el enfoque cambia de \"memorizar listas genéricas\" a \"aprender el vocabulario del contenido que realmente quieres leer\":"),
  bullet("Elige artículos de opinión, cuentos cortos o un tema técnico que te interese."),
  bullet("Extrae las palabras desconocidas de cada texto y añádelas a Anki — este es tu banco de B2, hecho a tu medida."),
  bullet("Empieza a notar matices: sinónimos, expresiones idiomáticas, phrasal verbs comunes (give up, look forward to, get along with)."),
  p("El proceso es siempre el mismo círculo: aprender palabras → leer contenido real de tu nivel → extraer las palabras nuevas del texto → volver a leer sin esfuerzo → subir de nivel."),
  p("Nota: el banco completo de B1 (con sus propias 10-15 semanas de vocabulario temático de noticias, argumentación y actualidad) se entregará como siguiente actualización de este documento, siguiendo el mismo formato que A1 y A2."),
];

// ---------- SECCIÓN 8: CRITERIOS DE AVANCE ----------
const criterios = [
  h1("8. Criterios para saber cuándo avanzar de nivel"),
  p("No cambies de nivel solo porque terminaste el calendario. Avanza cuando se cumplan estas tres condiciones:"),
  bullet("Puedes leer un texto típico de tu nivel actual entendiendo el 90% o más sin diccionario."),
  bullet("La mayoría de tus tarjetas de Anki de ese nivel están marcadas como \"fáciles\" o tienen intervalos largos de repaso."),
  bullet("Un test de nivel gratuito en línea (por ejemplo EF SET o el test de Cambridge) confirma que estás en ese nivel o por encima."),
  p("Si fallas alguno de los tres puntos, no pasa nada: quédate una o dos semanas más repasando y leyendo antes de subir. El objetivo es una base sólida, no una carrera."),
  new Paragraph({ spacing: { before: 300 }, children: [
    new TextRun({ text: "Consejo final: ", bold: true, size: 22, color: NAVY }),
    new TextRun({ text: "la constancia diaria de 20-30 minutos vale más que sesiones largas y esporádicas. Este documento es una guía viva — anota tu progreso, tacha las semanas completadas y ajusta el ritmo según tu vida real.", size: 22, color: "262626" }),
  ]}),
];

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 260 } } } }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_WIDTH_DXA, height: PAGE_HEIGHT_DXA },
        margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      },
    },
    children: [
      ...cover,
      ...intro,
      pageBreak(),
      ...anki,
      pageBreak(),
      ...calendario,
      pageBreak(),
      ...bankIntro,
      ...wordSections,
      pageBreak(),
      ...a1toa2,
      pageBreak(),
      ...bankA2Intro,
      ...wordSectionsA2,
      pageBreak(),
      ...b1b2,
      pageBreak(),
      ...criterios,
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Plan_de_estudio_ingles_A1_a_B2.docx", buffer);
  console.log("Documento generado.");
});


