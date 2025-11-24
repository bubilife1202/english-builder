# [기술 명세서] Grammar Guardian: Zero-Server Architecture

**작성자:** Jules (Lead Architect)
**버전:** v1.0
**날짜:** 2024-05-22

---

## 1. 시스템 아키텍처 (System Architecture)

본 프로젝트는 **외부 네트워크 통신 없는 완전 로컬(Standalone)** 구동을 목표로 합니다.
Unity 엔진 위에서 AI 로직(STT, NLP)이 네이티브 플러그인 형태로 동작합니다.

### 1.1. High-Level Diagram

```mermaid
graph TD
    User[사용자 (Player)] -->|음성/터치| InputLayer[입력 계층 (Unity UI/Mic)]

    subgraph "Client Side (Device)"
        InputLayer --> BattleSys[전투 시스템 (Turn-based)]

        BattleSys -->|문장 데이터| LocalNLP[로컬 NLP 엔진]

        subgraph "AI Core (Zero Cost)"
            LocalNLP -->|Speech Audio| NativeSTT[OS Native STT API]
            LocalNLP -->|Sentence Text| TFLite[TensorFlow Lite / Unity Sentis]
            TFLite -->|Grammar Score| LocalNLP
        end

        BattleSys -->|결과| RenderSys[렌더링 시스템]
        BattleSys -->|로그| LocalDB[로컬 DB (SQLite/JSON)]
    end
```

---

## 2. 핵심 기술 스택 (Tech Stack)

### 2.1. Game Engine
*   **Unity 6 (LTS):** 모바일 최적화 및 Cross-Platform 빌드 용이.

### 2.2. AI & NLP (On-Device)
1.  **Speech-to-Text (STT):**
    *   **Android:** `SpeechRecognizer` (Android SDK) - *오프라인 모드 강제 설정*
    *   **iOS:** `SFSpeechRecognizer` (Speech framework) - *`requiresOnDeviceRecognition = true`*
    *   **Fallback:** `Whisper.cpp` (Unity Plugin) - OS 지원 불가 기기 대응.
2.  **Grammar Check (NLP):**
    *   **1차 검증 (Heuristic):** 사전 정의된 문장 패턴(S+V+O) 매칭 알고리즘. (속도 < 10ms)
    *   **2차 검증 (ML):** MobileBERT-Lite 모델 (Unity Sentis 구동). 문장의 자연스러움(Perplexity) 판단.

### 2.3. Data Storage
*   **SQLite:** 유저의 단어 숙련도, 퀘스트 진행도, 아이템 데이터 저장.
*   **JSON:** 정적 데이터(몬스터 정보, 스킬 카드 정보).

---

## 3. 데이터 구조 설계 (Data Structures)

### 3.1. WordCard (단어 카드)
전투 시 스킬의 재료가 되는 단어 데이터입니다.

```csharp
[Serializable]
public class WordCard {
    public int id;
    public string text;      // 예: "Strike"
    public WordType type;    // Verb, Noun, Adjective...
    public int manaCost;     // 소모 MP
    public int damagePower;  // 공격력 계수
}
```

### 3.2. SentenceSkill (문장 스킬)
유저가 조합한 문장의 결과물입니다.

```csharp
public class SentenceSkill {
    public List<WordCard> components; // 조합된 카드들
    public string fullSentence;       // "I strike the goblin"
    public bool isValidGrammar;       // 문법 정확도
    public float finalDamage;         // 계산된 최종 데미지
}
```

---

## 4. 로컬 NLP 처리 로직 (Local NLP Logic)

서버 없이 문법을 검사하기 위한 2단계 파이프라인입니다.

1.  **Tokenization:** 입력된 문장을 단어 단위로 분리.
2.  **Pattern Matching:**
    *   `Subject` + `Verb` + `Object` 구조가 맞는지 확인.
    *   예: "I" (Noun/Subject) + "eat" (Verb) + "apple" (Noun/Object) -> **Pass**
    *   예: "Eat" (Verb) + "I" (Noun) -> **Fail**
3.  **Tense Check:** 시제 일치 여부 확인 (Yesterday + eat -> Fail).

---

## 5. 최적화 전략 (Optimization)

*   **메모리 관리:** 텐서플로우 모델은 전투 진입 시에만 로드하고, 전투 종료 시 메모리 해제.
*   **배터리 소모 방지:** STT는 유저가 "말하기 버튼"을 누르고 있을 때만 마이크 활성화.
*   **용량 최적화:** 음성 데이터는 저장하지 않고 텍스트 로그만 저장.

---

**승인 요청:**
상기 기술 명세에 따라 프로토타입 개발(Phase 1)을 시작하도록 하겠습니다.
