(function () {
  "use strict";
  var countEl = document.getElementById("wordCount");
  var syllEl = document.getElementById("syllableCount");
  var output = document.getElementById("wordOutput");
  var genBtn = document.getElementById("genBtn");
  var copyBtn = document.getElementById("copyBtn");
  var typeBtns = document.querySelectorAll("[data-wtype]");
  var currentType = "syllable";

  var ONSETS = ["b","c","d","f","g","h","j","k","l","m","n","p","r","s","t","v","w","y","bl","br","cl","cr","dr","fl","fr","gl","gr","pl","pr","sc","sk","sl","sm","sn","sp","st","sw","tr","tw","sh","ch","th","wh","zh"];
  var NUCLEI = ["a","e","i","o","u","ai","au","ei","ee","oa","oo","ou"];
  var CODAS = ["","b","ck","d","f","g","k","l","m","n","ng","p","r","s","sh","t","th","x","z","st","nd","rd"];

  var COMMON_WORDS = [
    "ability","about","above","accept","according","account","achieve","across","action","activity",
    "actually","addition","address","admit","adopt","adult","after","again","against","agency",
    "agree","ahead","airline","alarm","album","algorithm","alien","align","alive","allow",
    "almost","alone","alpha","already","always","amazing","among","amount","animal","annual",
    "answer","anyone","anyway","appeal","appear","apple","apply","arrive","artist","aspect",
    "assess","asset","assume","attach","attack","attend","author","autumn","avocado","aware",
    "awful","bacon","badge","badly","banana","banner","barrel","basic","basket","battle",
    "beach","beast","begin","behalf","behave","behind","belong","beside","better","beyond",
    "bishop","blame","blank","blast","blaze","bleed","blend","bless","blind","block",
    "blood","board","bonus","boost","bound","brain","brand","brave","bread","break",
    "breed","brick","brief","bring","broad","broke","brook","brush","buddy","build",
    "burst","buyer","cabin","cable","camel","candy","cargo","carry","catch","cause",
    "cease","chain","chair","chaos","charm","chase","cheap","check","cheek","cheer",
    "chess","chest","chief","child","china","chunk","civic","civil","claim","clash",
    "class","clean","clear","climb","cling","clock","clone","close","cloth","cloud",
    "coach","coast","color","comet","comic","coral","could","count","court","cover",
    "crack","craft","crane","crash","crazy","cream","crest","crime","crisp","cross",
    "crowd","crown","crush","curve","cycle","daily","dance","death","debut","decay",
    "delay","delta","dense","depth","derby","desktop","desert","design","detect","device",
    "differ","dinner","direct","doctor","dodge","donor","doubt","dozen","draft","drain",
    "drama","drank","drawn","dream","dress","drift","drill","drink","drive","drone",
    "drown","drunk","dryer","dying","eager","eagle","early","earth","eight","elder",
    "elect","elite","email","ember","empty","enemy","enjoy","enter","entry","equal",
    "error","essay","ethic","event","every","exact","exams","exile","exist","extra",
    "fable","facet","faith","fancy","fault","feast","fence","ferry","fever","fiber",
    "field","fifth","fifty","fight","final","first","flame","flash","fleet","flesh",
    "float","flood","floor","flora","flour","fluid","flush","flute","focus","force",
    "forge","forth","forum","found","frame","frank","fraud","fresh","front","frost",
    "fruit","fully","fungi","fuzzy","gamma","genus","ghost","giant","given","glass",
    "gleam","glide","globe","gloom","glory","gloss","glove","going","grace","grade",
    "grain","grand","grant","graph","grasp","grass","grave","great","green","greet",
    "grief","grill","grind","groan","groom","gross","group","grove","grown","guard",
    "guess","guide","guild","guilt","piano","piece","pilot","pitch","pixel","pizza",
    "place","plain","plane","plant","plate","plaza","plead","pluck","plumb","plume",
    "point","polar","pound","power","press","price","pride","prime","print","prior",
    "prize","probe","prone","proof","prose","proud","prove","proxy","pulse","punch",
    "pupil","purse","queen","query","quest","queue","quick","quiet","quota","quote",
    "radar","radio","raise","rally","ranch","range","rapid","ratio","reach","react",
    "realm","rebel","refer","reign","relax","relay","renal","renew","repay","reply",
    "rider","rifle","right","rigid","risky","rival","river","robin","robot","rocky",
    "rouge","rough","round","route","royal","rugby","ruler","rural","salad","scale",
    "scare","scene","scent","scope","score","scout","scrap","sense","serve","setup",
    "seven","shade","shall","shame","shape","share","shark","sharp","shave","sheep",
    "sheer","sheet","shelf","shell","shift","shine","shirt","shock","shore","short",
    "shout","sight","sigma","since","sixth","sixty","skill","skull","slate","slave",
    "sleep","slice","slide","slope","small","smart","smell","smile","smoke","solar",
    "solid","solve","sorry","sound","south","space","spare","spark","speak","speed",
    "spend","spill","spine","spite","spoke","sport","spray","squad","stack","staff",
    "stage","stake","stain","stair","stake","stale","stall","stamp","stand","stare",
    "stark","start","state","stays","steal","steam","steel","steep","steer","stern",
    "stick","stiff","still","stock","stole","stone","stood","stool","store","storm",
    "story","stout","stove","strap","straw","stray","strip","stuck","study","stuff",
    "style","sugar","suite","sunny","super","surge","swamp","swear","sweep","sweet",
    "swept","swift","swing","sword","swore","sworn","swung","table","taste","teach",
    "teeth","tempo","tempt","tenor","tense","tenth","terms","theft","theme","there",
    "thick","thief","thing","think","third","thorn","those","three","threw","throw",
    "thumb","tiger","tight","timer","title","toast","today","token","total","touch",
    "tough","towel","tower","toxic","trace","track","trade","trail","train","trait",
    "trash","treat","trend","trial","tribe","trick","tried","truly","trump","trunk",
    "trust","truth","tumor","twice","twist","ultra","under","union","unite","unity",
    "until","upper","upset","urban","usage","usual","utter","valid","valve","vault",
    "venue","verse","video","vigor","vinyl","viral","virus","visit","vista","vital",
    "vivid","vocal","voice","voter","wages","waste","watch","water","weary","weave",
    "wedge","weigh","weird","whale","wheat","wheel","where","which","while","white",
    "whole","whose","wider","witch","woman","world","worry","worse","worst","worth",
    "would","wound","wrath","write","wrote","yacht","yield","young","youth","zebra"
  ];

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateSyllableWord(syllables) {
    var word = "";
    for (var i = 0; i < syllables; i++) {
      word += randomFrom(ONSETS);
      word += randomFrom(NUCLEI);
      if (i === syllables - 1) word += randomFrom(CODAS);
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function generateWords() {
    var count = parseInt(countEl.value, 10);
    var syllables = parseInt(syllEl.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 100) count = 100;
    if (isNaN(syllables) || syllables < 1) syllables = 1;
    if (syllables > 6) syllables = 6;

    var words = [];
    for (var i = 0; i < count; i++) {
      if (currentType === "syllable") {
        words.push(generateSyllableWord(syllables));
      } else {
        words.push(randomFrom(COMMON_WORDS));
      }
    }
    output.textContent = words.join("\n");
  }

  genBtn.addEventListener("click", generateWords);

  typeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      typeBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentType = btn.dataset.wtype;
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Random words will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
