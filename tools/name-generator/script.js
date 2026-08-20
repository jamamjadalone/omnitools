(function () {
  "use strict";
  var countEl = document.getElementById("nameCount");
  var output = document.getElementById("nameOutput");
  var genBtn = document.getElementById("nameBtn");
  var copyBtn = document.getElementById("copyBtn");
  var genderBtns = document.querySelectorAll("[data-ngender]");
  var currentGender = "any";

  var MALE_FIRST = ["James","John","Robert","Michael","David","William","Richard","Joseph","Thomas","Charles","Christopher","Daniel","Matthew","Anthony","Mark","Donald","Steven","Paul","Andrew","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob","Gary","Nicholas","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin","Samuel","Raymond","Gregory","Frank","Alexander","Patrick","Jack","Dennis","Jerry","Tyler","Aaron","Jose","Adam","Nathan","Henry","Douglas","Peter","Zachary","Kyle","Noah","Ethan","Jeremy","Walter","Christian","Keith","Roger","Terry","Austin","Sean","Gerald","Carl","Harold","Dylan","Arthur","Lawrence","Jordan","Jesse","Bryan","Billy","Bruce","Gabriel","Joe","Logan","Albert","Willie","Alan","Eugene","Russell","Vincent","Philip","Bobby","Harry","Johnny","Mason","Derek","Luis","Randy","Howard","Carlos","Wayne","Ralph","Roy","Elijah","Danny","Hugh","Randy","Louis","Eli"];
  var FEMALE_FIRST = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Dorothy","Kimberly","Emily","Donna","Michelle","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia","Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen","Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Janet","Catherine","Maria","Heather","Diane","Ruth","Julie","Olivia","Joyce","Virginia","Victoria","Kelly","Lauren","Christina","Joan","Evelyn","Judith","Megan","Andrea","Cheryl","Hannah","Jacqueline","Martha","Gloria","Teresa","Ann","Sara","Madison","Frances","Kathryn","Janice","Jean","Abigail","Alice","Judy","Sophia","Grace","Denise","Amber","Doris","Marilyn","Danielle","Beverly","Isabella","Theresa","Diana","Natalie","Brittany","Charlotte","Marie","Kayla","Alexis","Lori"];
  var LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Gomez","Phillips","Evans","Turner","Diaz","Parker","Cruz","Edwards","Collins","Reyes","Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson","Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes","Price","Alvarez","Castillo","Sanders","Patel","Myers","Long","Ross","Foster","Jimenez","Powell","Jenkins","Perry","Russell","Sullivan","Bell","Coleman","Butler","Henderson","Barnes","Gonzales","Fisher","Vasquez","Simmons","Patterson","Jordan","Reynolds","Hamilton","Graham","Wallace","Gibson","Bryant","Alexander","Tucker","Harvey","Marshall","Hunt","Freeman","Webb","Burns","Spencer","Stone","Wagner","Hayes","Hart","Cole","West","Ford","Mason","Dixon","Morrison","Black","Wallace","Grant","Boyd","Pierce","Rose","Hawkins","Hunter","Fox","Wells","Stone","Ray","Stone","Dunn","Knight","Warren","Holmes","Shaw","Perkins","Fox","Stone","Ray","Dunn","Knight"];
  var FANTASY_FIRST = ["Aelindra","Baelor","Caelum","Drystan","Elowen","Faenor","Galadris","Haldir","Ilyndra","Jorath","Kaelthas","Lyralei","Maevrin","Nythara","Orinthal","Pyraxis","Quelindra","Rhydian","Sylthas","Thalion","Uldris","Vaelora","Wyndral","Xylara","Ylindra","Zephyros","Arannis","Belthor","Cyndra","Daelith","Eryndor","Faelorn","Galaris","Haelra","Ildrin","Jaelora","Kelryn","Lorindel","Myrthas","Naelorn","Oryndra","Phaelin","Qyndra","Rhylas","Saelith","Taelorn","Uldora","Vylindra","Wynlohr","Xaelin","Ylthara","Zaelith","Ashara","Bryndal","Caelynn","Daelith","Elphira","Faelorn","Gwynara","Helyndra","Ithilien","Jaelith","Kylara","Lithara","Mythrandil","Naelith","Ophira","Pyralis","Quinthar","Rhyolith","Sylara","Thaelorn","Ulthara","Valyndra","Wynthara","Xylthas","Ylthara","Zaelthas"];
  var FANTASY_LAST = ["Stormborn","Fireheart","Shadowmere","Lightbringer","Frostweaver","Starwind","Darkhollow","Silverhand","Goldleaf","Ironforge","Stormshield","Duskwhisper","Dawnbreaker","Nightblade","Sunfire","Moonshadow","Thunderstrike","Windrunner","Stoneguard","Firewalker","Shadowbane","Starfall","Duskwing","Dawnstar","Nightwhisper","Sunshadow","Moonrise","Thunderstone","Windshadow","Ironheart","Stormchaser","Frostborn","Firebrand","Shadowveil","Starweaver","Duskfall","Dawnguard","Nightfall","Sunstone","Moonfire","Thunderclap","Windward","Ironclad","Stormrider","Frostheart","Fireblood","Shadowlight","Starcrest","Duskrose","Dawnchaser","Nightbloom","Sunward","Moonblade","Thunderhawk","Windborn","Ironwing","Stormveil","Frostwhisper","Fireshade","Shadowthorn","Stardust","Duskmoon","Dawnsworn","Nightstar","Sunshard","Moonveil","Thunderheart","Windchaser","Ironbloom","Stormcrest","Frostblood","Firecrest","Shadowdancer","Starbloom","Duskthorn","Dawnsong","Nightwhisper","Sunblade","Moonheart","Thunderfire","Windthorn","Ironrose","Stormblood","Frostveil","Fireveil","Shadowmoon","Starheart","Duskwind","Dawnfire","Nightveil","Sunthorn","Moondust","Thunderrose","Windfire","Ironveil","Stormshard","Frostwind","Firethorn","Shadowstar","Stardust","Duskfire","Dawndust","Nightfire","Sunguard","Moonfire","Thunderveil","Windrose","Ironbloom"];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateFantasySurname() {
    var parts = ["Storm","Fire","Shadow","Light","Frost","Star","Dark","Silver","Gold","Iron","Dusk","Dawn","Night","Sun","Moon","Thunder","Wind","Stone","Ember","Crystal","Mist","Frost","Blood","Veil","Bloom","Crest","Rider","Vane","song","blade","ward","born","heart","blood","hand","leaf","forge","shield","mere","fall","guard","whisper","break","rise","ward","strike","claw","song","crest","bloom","dust","shade","thorn","rose","moon","sun","wind","star","fire"];
    var suffixes = ["born","heart","weaver","bringer","blade","guard","runner","seeker","walker","caller","born","hand","fall","ward","fire","shine","bane","born","veil","crest","whisper","shadow","light","storm","wind","stone","blood","moon","sun","star","dust","shade","thorn","rose","song","claw","forge","shield","mere","dawn","dusk","night","clap","ward","rise","chaser","fall","sworn","bloom","shard","shade","dancer","fire","dust","veil","fire","rose","veil","fire"];
    return pickRandom(parts) + pickRandom(suffixes);
  }

  function generate() {
    var count = parseInt(countEl.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 100) count = 100;

    var names = [];
    for (var i = 0; i < count; i++) {
      var first, last;
      if (currentGender === "fantasy") {
        first = pickRandom(FANTASY_FIRST);
        last = pickRandom(FANTASY_LAST);
      } else if (currentGender === "male") {
        first = pickRandom(MALE_FIRST);
        last = pickRandom(LAST_NAMES);
      } else if (currentGender === "female") {
        first = pickRandom(FEMALE_FIRST);
        last = pickRandom(LAST_NAMES);
      } else {
        first = Math.random() > 0.5 ? pickRandom(MALE_FIRST) : pickRandom(FEMALE_FIRST);
        last = pickRandom(LAST_NAMES);
      }
      names.push(first + " " + last);
    }
    output.textContent = names.join("\n");
  }

  genBtn.addEventListener("click", generate);

  genderBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      genderBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentGender = btn.dataset.ngender;
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Random names will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
