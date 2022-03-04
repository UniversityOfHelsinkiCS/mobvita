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
  
module.exports = { postYandexTTS }