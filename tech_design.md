# [기술 명세서 Rev.3] WonderWord: 2D Platformer Architecture

**작성자:** Jules (Lead Architect)
**날짜:** 2024-05-22

---

## 1. 아키텍처 개요 (Overview)

Unity 2D 물리 엔진(Physics2D)을 기반으로 한 플랫폼 게임입니다.
기존의 정적인 UI 기반 게임에서 벗어나, **Rigidbody2D**와 **Animator State Machine**이 핵심이 됩니다.

### 1.1. System Diagram

```mermaid
graph TD
    Input[Input System] -->|Joystick/Buttons| PlayerCtrl[Player Controller 2D]
    Mic[Microphone] -->|KWS (Keyword Spotting)| VoiceMgr[Voice Skill System]

    VoiceMgr -->|Trigger Event| PlayerCtrl

    subgraph "Game Loop"
        PlayerCtrl -->|Change State| Anim[Animator]
        PlayerCtrl -->|Physics| RB[Rigidbody2D]

        PlayerCtrl -->|Hit| DmgSys[Damage Number System]
    end
```

---

## 2. 핵심 컴포넌트 설계

### 2.1. PlayerController2D (물리 및 이동)
*   **역할:** 이동, 점프, 중력 처리, 애니메이션 동기화.
*   **기술:**
    *   `Rigidbody2D.velocity`: 부드러운 이동.
    *   `Physics2D.Raycast`: 바닥 감지 (Ground Check) - 점프 가능 여부 판단.
    *   `Coyote Time`: 점프 타이밍 보정 (플랫폼 끝에서 떨어져도 잠시 점프 허용) - *손맛의 핵심*.

### 2.2. VoiceSkillSystem (음성 스킬)
*   **역할:** 음성 명령을 입력받아 캐릭터의 특정 액션(Attack State)으로 변환.
*   **매핑 테이블:**
    *   "Attack" / "Hit" -> 기본 베기 (Animation: Attack1)
    *   "Fire" / "Burn" -> 화염 스킬 (Animation: Skill_Fire)
    *   "Heal" -> 회복 (Animation: Buff)

### 2.3. DamageSkinSystem (타격감)
*   **역할:** 데미지 숫자를 파티클처럼 튀어 오르게 연출.
*   **구현:**
    *   Object Pooling: 수많은 숫자가 뜨고 사라지므로 가비지 컬렉션(GC) 방지.
    *   Animation: 크기(Scale)가 커졌다가 작아지며(Bounce), 투명해지며 위로 사라짐.

---

## 3. 데이터 구조 (Data Assets)

### 3.1. SkillScriptableObject
유니티 인스펙터에서 디자이너가 쉽게 스킬을 추가/수정하도록 설계.

```csharp
[CreateAssetMenu(fileName = "New Skill", menuName = "WonderWord/Skill")]
public class SkillData : ScriptableObject {
    public string skillName;
    public string[] voiceKeywords; // ["FIRE", "FLAME", "BURN"]
    public float damagePercent;
    public GameObject effectPrefab;
    public AudioClip soundEffect;
}
```

---

## 4. 최적화 및 이슈 관리

### 4.1. 오디오 레이턴시 (Audio Latency)
*   블루투스 이어폰 사용 시 딜레이 문제 발생 가능.
*   **해결:** 게임 내 '오디오 보정(Calibration)' 옵션 제공 또는 시각적 피드백(이펙트)을 먼저 띄우고 판정은 후처리.

### 4.2. 2D 물리 이슈
*   벽 뚫기(Tunneling) 방지: `Rigidbody2D.collisionDetectionMode`를 `Continuous`로 설정.

---

**결론:** 메이플스토리의 조작감에 음성 인식을 얹어, 기술적으로도 재미 면에서도 완성도 높은 횡스크롤 액션을 구현하겠습니다.
