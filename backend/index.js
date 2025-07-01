const express = require('express');
const multer = require('multer');
const { zerox } = require('zerox');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 设置文件存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        console.log('File uploaded:', req.file.path);
        const result = await zerox({
            filePath: req.file.path,
            credentials: {
                apiKey: "", // 确保设置了您的OpenAI API密钥
                outputDir: `./output`,
            },
        });
        //TODO: 将result的markdown读取出来
        let finalMarkdown = '';
        for (const page of result.pages) {
            const markdown = page.content;
            finalMarkdown += markdown + '\n\n';
        }
        console.log('Conversion result:', result);
        res.json({ 
            markdown: finalMarkdown, 
            pdfUrl: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Error converting PDF:', error);
        res.status(500).send('Error converting PDF.');
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});