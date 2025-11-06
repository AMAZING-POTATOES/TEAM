package com.proj.food.rottenpotato.controller;

import com.proj.food.rottenpotato.service.ReceiptTextParser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ReceiptParserTestController {

    @GetMapping("/test/parse")
    public List<Map<String, Object>> testParse() {
        String sampleText = """
                001 강된장보리비빔밥 2 9,980원
                002 컵반돼지김치찌개밥 2 9,980원
                003 매일바이오백도 2 7,980원
                004 스테비아토마토(팩) 2 19,980원
                005 산지그대로_사과_4-6 1 4,990원
                """;

        return ReceiptTextParser.parseReceipt(sampleText);
    }
}
