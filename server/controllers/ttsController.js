const axios = require('axios');
const FormData = require('form-data')

const postYandexTTS = async (req, res) => {
    try{
        const { text, lang_code, tone } = req.body
        const form = new FormData()
        form.append('text', text)
        form.append('lang', lang_code)
        form.append('voice', tone)
        var config = {
            method: 'post',
            url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
            headers: { 
                'Authorization': 'Api-Key AQVN3Y3Vf7AMbWtbgGnp3daPjL0M9SCa28g10u8N', 
                ...form.getHeaders()
            },
            data : form,
            responseType: 'arraybuffer'
        }
        const response = await axios(config)
        res.contentType('audio/opus')
        res.end(Buffer.from(response.data, 'binary'))
    }catch(e){
        console.log(e)
        res.status(500)
        res.send('Not OK')
    }
    
}

const getYandexTTS = async (req, res) => {
    try{
        const { text, lang_code, tone } = req.query
        const form = new FormData()
        form.append('text', text)
        form.append('lang', lang_code)
        form.append('voice', tone)
        var config = {
            method: 'post',
            url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
            headers: { 
                'Authorization': 'Api-Key AQVN3Y3Vf7AMbWtbgGnp3daPjL0M9SCa28g10u8N', 
                ...form.getHeaders()
            },
            data : form,
            responseType: 'arraybuffer'
        }
        const response = await axios(config)
        res.contentType('audio/opus')
        res.end(Buffer.from(response.data, 'binary'))
    }catch(e){
        console.log(e)
        res.status(500)
        res.send('Not OK')
    }
    
}


const getFinTTS = async (req, res) => {
    try{
        const { text } = req.query
        var config = {
            method: 'post',
            url: 'http://hpz440-2.cs.helsinki.fi:6000/fin_synthesizer',
            headers: {'Content-Type': 'application/json'},
            data : {text: text},
            responseType: 'arraybuffer'
        }

        const response = await axios(config)
        res.contentType('audio/mp3')
        res.end(response.data)
    }catch(e){
        console.log(e)
        res.status(500)
        res.send('Not OK')
    }
    
}

module.exports = { postYandexTTS, getYandexTTS, getFinTTS }