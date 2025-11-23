// server.js
const express = require('express');
const cors = require('cors');
const { generateRecipe } = require('./geminiService');

const app = express();
const port = 8000; // 포트 번호

// 미들웨어 설정
app.use(cors()); // 모든 요청 허용 (개발용)
app.use(express.json()); // JSON 데이터를 받을 수 있게 설정

// 라우터 설정
app.post('/api/generate-recipe', async (req, res) => {
  try {
    console.log("레시피 생성 요청 받음!");
    
    // 프론트(Spring Boot)에서 보낸 데이터는 req.body에 들어있음
    const inputData = req.body;

    // 입력 데이터 로그 찍어보기 (디버깅용)
    // console.log("요청 데이터:", JSON.stringify(inputData, null, 2));

    // AI 서비스 호출
    const result = await generateRecipe(inputData);

    // 결과 반환
    res.json(result);

  } catch (error) {
    console.error("❌ 서버 내부 치명적 오류:", error);
    res.status(500).json({ 
        success: false, 
        message: "서버 내부 오류",
        details: error.toString() 
    });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`AI 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});