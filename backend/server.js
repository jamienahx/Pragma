require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var cors = require('cors');
var app = express();

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY})

  const languages = require('./languages.json')



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

//the request
app.post("/api/generate", async (req, res)=>{
  const {identityInput, otherPartyInput, descriptionInput,language}= req.body;

  const selectedLanguage = languages.find((lang)=>lang.code ===language)?.name||language; 
  const prompt = 
  `The user is a ${identityInput}.
They are speaking to a ${otherPartyInput}.

Situation:
${descriptionInput}

Generate 5–8 realistic phrases that would be used in this situation in ${selectedLanguage}.

Return ONLY a JSON array in this exact format:
[
  {
    "native": "phrase in ${selectedLanguage}",
    "romanized": "romanized pronunciation",
    "english": "english translation"
  }
]
Keep the tone appropriate for the situation.
Do not include any extra text, explanation, or formatting.`;


  try {

    const completion = await openai.chat.completions.create({
      model:"gpt-4.1-mini",
      messages:[
        {role: "system", content:"You help users generate likely phrases used in provided scenarios"},
        {role: "user", content:prompt}
      ]
    })

    const raw = completion.choices[0].message.content;

    if(!raw) {
      return res.status(500).json({error:"Server error"})
    }

    let parsed;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", raw);
      return res.status(500).json({error:"Invalid response format"})
    }
    res.json({result: parsed});

  } catch (error) {

    console.error(error);
    res.status(500).json({error:"Something went wrong!"})

  }

  })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//test environment
//app.listen(3000, () => {
  //console.log('Test environment is ready for launch!');
//})

module.exports = app;
