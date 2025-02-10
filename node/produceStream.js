const fs = require('fs').promises; // Promeças
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');

async function fileNames() { // "Prometo que vou devolver/retornar uma lista de strings"
    const mp4Fold = path.join(__dirname, '../assets/mp4')

    try {
        const files = await fs.readdir(mp4Fold);
        const mp4Videos = files.filter(file => file.endsWith('.mp4'));
        return mp4Videos;
    } catch (err) {
        console.error("Erro ao ler a pasta", err);
        throw err; // Rejeita a Promessa se ocorrer um erro
    }
}

function convertVideos(listMp4Videos) {

    for (file of listMp4Videos) {
        //console.log(`${file.replace('.mp4', '')}`)
        const inputVideo = path.join(__dirname, `../assets/mp4/${file}`);
        const outputDirectory = path.join(__dirname, '../assets/output');

        ffmpeg(inputVideo)
            .outputOptions([
                '-c:v h264',
                '-hls_time 10', // Define a duração de cada segmento HLS em segundos
                '-hls_list_size 0', // Mantém uma lista infinita de segmentos na playlist
            ])
            .output(`${outputDirectory}/${file.replace('.mp4', '')}.m3u8`)
            .on('end', () => {
                console.log(`Conversão do ${file.replace('.mp4', '')}.m3u8 concluída. HLS pronto para ser servido.`);
            })
            .on('error', (err) => {
                console.error('Erro durante a conversão:', err);
            })
            .run();
    }
}

fileNames()
    .then(mp4Videos => { // Reccebo o callback quando a leitura da pasta é concluida e escolho o que fazer com o resultado (assíncrono)
        convertVideos(mp4Videos)
    })
    .catch(error => {
        console.error(error);
    });
//convertVideos(fileNames())




