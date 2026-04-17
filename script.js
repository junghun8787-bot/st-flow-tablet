// ==========================================
// 1. APP STATE, I18N & VARIABLES
// ==========================================
const STORAGE_KEY = "samsung_timer_v36_ARCHITECTURE"; 
let DESK_COUNT = 10; 
let timers = [];
let audioCtx = null; 

let draggedName = null; 
let draggedFromIndex = null; 
let draggedNameForList = null; 

let attendanceMap = new Map(); 
let finishedSet = new Set(); 
let assignOrderCounter = 0; 
let studentLevels = {}; 
let customStudentOrder = []; 
let guestList = []; 

let logLeftItems = []; 
let logRightItems = []; 

let academyName = "향촌삼성영어학원"; 
let className = "Maple Classroom";

let alarmVolume = 0.5; 
let ttsVolume = 0.8; 
let uiVolume = 0.5; 
let currentTheme = "1";

let currentLang = 'ko'; 

// 📌 미니게임 모드 상태
let isRouletteMode = false;
let rouletteAngle = 0;
let rouletteSpinning = false;
let roulettePlayers = [];

// ⭐ 아이콘 제거됨
const i18n = {
    en: {
        nav1: "STUDENTS", nav2: "TIMER", nav3: "LOG", nav4: "SETTING", nav5: "MINI GAME",
        logStart: "▶️ START LOG", logFinish: "🏁 FINISH LOG", exportLog: "💾 EXPORT LESSON LOG (.txt)",
        rosterMgt: "ROSTER MANAGEMENT", saveRoster: "💾 SAVE ROSTER DATA",
        placeholder: "Press Enter to add", msgSaveRoster: "Student roster data saved perfectly.",
        acadInfo: "ACADEMY INFO & DISPLAY", acadName: "Academy Name", className: "Class Name",
        timerCount: "⏱️ Timer Dashboard Count", colorTheme: "Color Theme (30 Colors)", nameColor: "Name Color",
        audioSetup: "AUDIO SETUP", alarmMelody: "Alarm Melody", uiSound: "UI Click Sound", ttsVoice: "🗣️ TTS Voice Assistant",
        volAlarm: "🔊 Alarm Volume", volTTS: "🗣️ Voice Volume", volUI: "🖱️ Click Volume",
        sysCtrl: "SYSTEM CONTROL", backupCreate: "📦 CREATE BACKUP (.json)", backupRestore: "📂 RESTORE BACKUP (.json)",
        softReset: "🔄 Soft Reset (Timers & Logs)", hardReset: "⚠️ Hard Reset (Factory Reset)",
        btnStart: "START", btnStop: "STOP", btnCancel: "CANCEL", btnFinish: "FINISH LESSON", btnClear: "CLR",
        statusAssign: "✔ Assigned", statusPlaying: "Playing", statusTimeUp: "🔔 Time Up", statusFinish: "Finished",
        logStartWord: "Started", logFinishWord: "Finished", logCancelWord: "Canceled",
        quickStart: "START", quickFinish: "FINISH",
        grpWait: "⏳ Students List", grpActive: "▶️ In Class", grpFinish: "🏁 FINISHED",
        noRecords: "No Records", langText: "🌐 Language / 언어",
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        alertSoft: "This will reset timers and logs only.\n(Rosters and settings are kept safe.) Proceed?",
        alertHard: "⚠️ WARNING ⚠️\nAll settings, rosters, and data will be permanently deleted.\nAre you sure you want to factory reset?",
        alertResetDone: "Reset completed successfully.", alertFactoryDone: "Factory reset complete. System will reboot.",
        alertBackupDone: "Backup restored! System will reboot.", alertBackupFail: "Invalid backup file."
    },
    ko: {
        nav1: "명단", nav2: "타이머", nav3: "기록", nav4: "설정", nav5: "게임",
        logStart: "▶️ 시작 기록 (START)", logFinish: "🏁 종료 및 완료 (FINISH)", exportLog: "💾 수업 로그 내보내기 (.txt)",
        rosterMgt: "학생 명단 관리", saveRoster: "💾 명단 저장하기",
        placeholder: "엔터로 이름 입력", msgSaveRoster: "학생 명단이 완벽하게 저장되었습니다.",
        acadInfo: "학원 정보 및 디스플레이", acadName: "학원 이름", className: "반 이름",
        timerCount: "⏱️ 타이머 개수 설정", colorTheme: "색상 테마 (30종)", nameColor: "이름 색상 (10종)",
        audioSetup: "오디오 및 효과음 설정", alarmMelody: "알람 멜로디", uiSound: "UI 클릭음", ttsVoice: "🗣️ TTS 음성 안내",
        volAlarm: "🔊 알람 볼륨", volTTS: "🗣️ 음성 볼륨", volUI: "🖱️ 클릭 볼륨",
        sysCtrl: "시스템 백업 및 초기화", backupCreate: "📦 백업 파일 저장 (.json)", backupRestore: "📂 백업 파일 불러오기 (.json)",
        softReset: "🔄 타이머 및 로그 초기화", hardReset: "⚠️ 모든 설정 공장 초기화",
        btnStart: "시작", btnStop: "정지", btnCancel: "취소", btnFinish: "수업 완료", btnClear: "초기화",
        statusAssign: "✔ 자리배정", statusPlaying: "수업 중", statusTimeUp: "🔔 시간 종료", statusFinish: "완료",
        logStartWord: "시작", logFinishWord: "완료", logCancelWord: "취소",
        quickStart: "시작", quickFinish: "종료",
        grpWait: "⏳ 반 학생들 (Students List)", grpActive: "▶️ 수업 중 (In class)", grpFinish: "🏁 수업 완료 (Finished)",
        noRecords: "기록 없음", langText: "🌐 Language / 언어",
        days: ['일', '월', '화', '수', '목', '금', '토'],
        alertSoft: "타이머 기록과 출결 로그만 초기화합니다.\n(명단과 학원 설정은 안전하게 유지됩니다.) 진행하시겠습니까?",
        alertHard: "⚠️ 경고 ⚠️\n학생 명단, 테마, 오디오 등 모든 설정이 완전히 삭제되고 처음 상태로 돌아갑니다.\n정말 공장 초기화하시겠습니까?",
        alertResetDone: "오늘의 수업 기록이 깔끔하게 리셋되었습니다.", alertFactoryDone: "모든 데이터가 초기화되었습니다. 시스템을 다시 시작합니다.",
        alertBackupDone: "데이터 복구 완료! 시스템을 재시작합니다.", alertBackupFail: "잘못된 백업 파일입니다."
    }
};

window.onload = () => { loadData(); updateDateUI(); }; 
setInterval(updateDateUI, 60000); 

// 브라우저 닫을 때 백그라운드 상태 강제 저장
window.addEventListener('beforeunload', () => { saveToStorage(); });

function updateDateUI() {
    const now = new Date(); const t = i18n[currentLang];
    const str = `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')} (${t.days[now.getDay()]})`;
    const el = document.getElementById('displayDate'); if(el) el.innerText = str;
}

function changeLanguage() { currentLang = document.getElementById("langSelect").value; saveToStorage(); applyLanguage(); }

function applyLanguage() {
    const t = i18n[currentLang];
    document.querySelectorAll("[data-i18n]").forEach(el => { el.innerText = t[el.getAttribute("data-i18n")]; });
    document.querySelectorAll(".editable-roster").forEach(el => { el.setAttribute("data-placeholder", t.placeholder); });
    updateDateUI(); generateStudents(); 
    for (let i = 0; i < DESK_COUNT; i++) updateBoxUI(i);
    renderLogs(); 
}

function switchView(view) {
    playUISound('tab');
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`view-${view}`).classList.add('active');
    document.querySelector(`.nav-tab[onclick*='${view}']`).classList.add('active');
    
    const homeBtn = document.getElementById('homeButtonContainer');
    if(homeBtn) {
        if(view === 'roster') homeBtn.classList.remove('visible');
        else homeBtn.classList.add('visible');
    }
    
    if(view === 'game') { 
        if(isRouletteMode && roulettePlayers.length === 0) setupRoulette(); 
        else if(!isRouletteMode && ladderPlayers.length === 0) setupLadder();
    }
}

function switchGameMode(mode) {
    playUISound('click');
    document.getElementById('gameResult').innerHTML = "";
    if(mode === 'ladder') {
        isRouletteMode = false;
        document.getElementById('ladder-game-area').style.display = 'block';
        document.getElementById('roulette-game-area').style.display = 'none';
        document.getElementById('tabLadder').classList.add('active-game-tab');
        document.getElementById('tabRoulette').classList.remove('active-game-tab');
        setupLadder();
    } else {
        isRouletteMode = true;
        document.getElementById('ladder-game-area').style.display = 'none';
        document.getElementById('roulette-game-area').style.display = 'block';
        document.getElementById('tabRoulette').classList.add('active-game-tab');
        document.getElementById('tabLadder').classList.remove('active-game-tab');
        setupRoulette();
    }
}

window.goToTimer = function(name) {
    let tIdx = timers.findIndex(t => t.student === name);
    if (tIdx !== -1) {
        playUISound('click');
        switchView('timer');
        setTimeout(() => {
            const box = document.getElementById(`box-${tIdx}`);
            if(box) {
                box.scrollIntoView({behavior: 'smooth', block: 'center'});
                box.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s';
                box.style.transform = 'scale(1.08) translateZ(0)';
                box.style.boxShadow = '0 0 0 4px var(--accent), 0 15px 30px rgba(0,0,0,0.2)';
                setTimeout(() => { box.style.transform = 'translateZ(0)'; box.style.boxShadow = ''; }, 1500);
            }
        }, 300);
    }
};

function updateCustomNames() {
    academyName = document.getElementById('inputAcademyName').value || "향촌삼성영어학원";
    className = document.getElementById('inputClassName').value || "Maple Classroom";
    document.getElementById('displayAcademyName').innerText = academyName;
    document.getElementById('displayClassName').innerText = className;
    saveToStorage();
}

function changeNameColor() {
    const val = document.getElementById("nameColorSelect").value; const root = document.documentElement;
    const shadowDark = '0 2px 4px rgba(0,0,0,0.8)'; const shadowLight = '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 2px 5px rgba(255,255,255,0.8)';
    if (val === 'black') { root.style.setProperty('--custom-name-color', '#000000'); root.style.setProperty('--custom-name-shadow', shadowLight); } 
    else if (val === 'white') { root.style.setProperty('--custom-name-color', '#ffffff'); root.style.setProperty('--custom-name-shadow', shadowDark); } 
    else if (val === 'yellow') { root.style.setProperty('--custom-name-color', '#fde047'); root.style.setProperty('--custom-name-shadow', shadowDark); } 
    else if (val === 'pink') { root.style.setProperty('--custom-name-color', '#fbcfe8'); root.style.setProperty('--custom-name-shadow', shadowDark); }
    else if (val === 'cyan') { root.style.setProperty('--custom-name-color', '#67e8f9'); root.style.setProperty('--custom-name-shadow', shadowDark); }
    else if (val === 'green') { root.style.setProperty('--custom-name-color', '#6ee7b7'); root.style.setProperty('--custom-name-shadow', shadowDark); }
    else if (val === 'orange') { root.style.setProperty('--custom-name-color', '#fb923c'); root.style.setProperty('--custom-name-shadow', shadowDark); }
    else if (val === 'purple') { root.style.setProperty('--custom-name-color', '#d8b4fe'); root.style.setProperty('--custom-name-shadow', shadowDark); }
    else if (val === 'gold') { root.style.setProperty('--custom-name-color', '#fbbf24'); root.style.setProperty('--custom-name-shadow', shadowDark); }
    else { root.style.setProperty('--custom-name-color', '#0f172a'); root.style.setProperty('--custom-name-shadow', 'none'); }
    saveToStorage();
}

function changeTheme() { currentTheme = document.getElementById("themeSelect").value; document.body.className = "theme-" + currentTheme; saveToStorage(); }
function updateVolumes() { alarmVolume = document.getElementById('volAlarm').value / 100; ttsVolume = document.getElementById('volTTS').value / 100; uiVolume = document.getElementById('volUI').value / 100; saveToStorage(); }

function changeDeskCount() {
    const newCount = parseInt(document.getElementById("deskCountSelect").value);
    if(newCount < timers.length) {
        for(let i=newCount; i<timers.length; i++) {
            if(timers[i].student !== "(empty)") {
                if(!confirm(`타이머 ${newCount+1}번 이상에 배치된 학생이 있습니다. 그래도 타이머를 줄이시겠습니까? (해당 학생은 자동으로 자리 취소됩니다.)`)) {
                    document.getElementById("deskCountSelect").value = DESK_COUNT; return;
                }
                break;
            }
        }
        for(let i=newCount; i<timers.length; i++) {
            stopTimer(i);
            if(timers[i].student !== "(empty)") { attendanceMap.delete(timers[i].student); updateStudentStatus(timers[i].student); }
        }
        timers.length = newCount;
    } else if(newCount > timers.length) {
        for(let i=timers.length; i<newCount; i++) { timers.push({ student: "(empty)", remainingTime: 0, totalTime: 0, overTime: 0, interval: null, isOver: false, lastTick: 0 }); }
    }
    DESK_COUNT = newCount; createInitialGrid(); saveToStorage();
}

function saveToStorage() {
    try {
        const studentsObj = { 
            PRE: getNamesFromContentEditable("studentInput_PRE").join("\n"), BASIC: getNamesFromContentEditable("studentInput_BASIC").join("\n"), 
            INTER: getNamesFromContentEditable("studentInput_INTER").join("\n"), ADV: getNamesFromContentEditable("studentInput_ADV").join("\n"), 
            PREP: getNamesFromContentEditable("studentInput_PREP").join("\n") 
        };
        const data = { 
            deskCount: DESK_COUNT, academyName: academyName, className: className, students: studentsObj, logLeftItems: logLeftItems, logRightItems: logRightItems, 
            attendance: Array.from(attendanceMap.entries()), finishedSet: Array.from(finishedSet), assignOrderCounter: assignOrderCounter, 
            timerStates: timers.map(t => ({ 
                student: t.student, remainingTime: t.remainingTime, totalTime: t.totalTime, overTime: t.overTime, isOver: t.isOver, startTimeStr: t.startTimeStr,
                isRunning: t.interval !== null, lastTick: t.lastTick 
            })), 
            vols: { a: alarmVolume, t: ttsVolume, u: uiVolume, ttsVoice: document.getElementById("ttsVoiceSelect").value, melody: document.getElementById("melodyType").value, uiType: document.getElementById("uiSoundType").value }, 
            theme: currentTheme, nameColor: document.getElementById("nameColorSelect").value, language: currentLang,
            customStudentOrder: customStudentOrder, guestList: guestList
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
}

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved); 
            if(data.language) { currentLang = data.language; document.getElementById("langSelect").value = currentLang; }
            if(data.deskCount) { DESK_COUNT = data.deskCount; document.getElementById("deskCountSelect").value = DESK_COUNT; }
            
            customStudentOrder = data.customStudentOrder || [];
            guestList = data.guestList || [];

            academyName = data.academyName || "향촌삼성영어학원"; className = data.className || "Maple Classroom";
            document.getElementById('inputAcademyName').value = academyName; document.getElementById('inputClassName').value = className;
            document.getElementById('displayAcademyName').innerText = academyName; document.getElementById('displayClassName').innerText = className; 
            
            if (data.students) { 
                if (typeof data.students === 'string') { updateContentEditable("studentInput_PRE", [data.students]); } 
                else { 
                    updateContentEditable("studentInput_PRE", (data.students.PRE || "").split('\n').filter(s=>s.trim()));
                    updateContentEditable("studentInput_BASIC", (data.students.BASIC || "").split('\n').filter(s=>s.trim()));
                    updateContentEditable("studentInput_INTER", (data.students.INTER || "").split('\n').filter(s=>s.trim()));
                    updateContentEditable("studentInput_ADV", (data.students.ADV || "").split('\n').filter(s=>s.trim()));
                    updateContentEditable("studentInput_PREP", (data.students.PREP || "").split('\n').filter(s=>s.trim()));
                } 
            }
            
            logLeftItems = data.logLeftItems || []; logRightItems = data.logRightItems || []; 
            attendanceMap = new Map(data.attendance || []); finishedSet = new Set(data.finishedSet || []); assignOrderCounter = data.assignOrderCounter || 0; 
            
            // 타이머 백그라운드 복구 로직
            timers = data.timerStates ? data.timerStates.map(ts => {
                let t = { ...ts, interval: null, lastTick: ts.lastTick || 0 };
                if (ts.isRunning && t.lastTick > 0) {
                    const now = Date.now();
                    const delta = Math.floor((now - t.lastTick) / 1000); 
                    if (delta > 0) {
                        if (t.remainingTime >= delta) {
                            t.remainingTime -= delta;
                        } else {
                            t.overTime += (delta - t.remainingTime);
                            t.remainingTime = 0;
                        }
                    }
                    t.lastTick = now - ((now - t.lastTick) % 1000); 
                }
                return t;
            }) : Array.from({length: DESK_COUNT}, () => ({ student: "(empty)", remainingTime: 0, totalTime: 0, overTime: 0, interval: null, isOver: false, lastTick: 0 }));
            
            while (timers.length < DESK_COUNT) { timers.push({ student: "(empty)", remainingTime: 0, totalTime: 0, overTime: 0, interval: null, isOver: false, lastTick: 0 }); }
            if (timers.length > DESK_COUNT) { timers.length = DESK_COUNT; }

            if(data.vols) { 
                alarmVolume = data.vols.a; ttsVolume = data.vols.t; uiVolume = data.vols.u !== undefined ? data.vols.u : 0.5; 
                document.getElementById("volAlarm").value = data.vols.a * 100; document.getElementById("volTTS").value = data.vols.t * 100; document.getElementById("volUI").value = uiVolume * 100; 
                if(data.vols.ttsVoice !== undefined) document.getElementById("ttsVoiceSelect").value = data.vols.ttsVoice; else document.getElementById("ttsVoiceSelect").value = "1"; 
                if(data.vols.melody) document.getElementById("melodyType").value = data.vols.melody; 
                if(data.vols.uiType) document.getElementById("uiSoundType").value = data.vols.uiType; 
            }
            if(data.theme) { currentTheme = data.theme; document.getElementById("themeSelect").value = currentTheme; document.body.className = "theme-" + currentTheme; }
            if(data.nameColor) { document.getElementById("nameColorSelect").value = data.nameColor; changeNameColor(); }
            
            applyLanguage(); createInitialGrid(); generateStudents(); renderLogs();
            
            if (data.timerStates) {
                data.timerStates.forEach((ts, idx) => {
                    if (ts.isRunning && timers[idx].student !== "(empty)") {
                        resumeTimer(idx);
                    }
                });
            }

        } else {
            updateContentEditable("studentInput_PRE", []); updateContentEditable("studentInput_BASIC", []); updateContentEditable("studentInput_INTER", []); updateContentEditable("studentInput_ADV", []); updateContentEditable("studentInput_PREP", []);
            timers = Array.from({length: DESK_COUNT}, () => ({ student: "(empty)", remainingTime: 0, totalTime: 0, overTime: 0, interval: null, isOver: false, lastTick: 0 }));
            applyLanguage(); createInitialGrid(); generateStudents();
        }
    } catch(e) { applyLanguage(); createInitialGrid(); }
}

function exportData() { 
    saveToStorage(); const data = localStorage.getItem(STORAGE_KEY); 
    const blob = new Blob([data], {type: "application/json"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); 
    a.download = `Timer_Backup_PC_${new Date().toISOString().slice(0,10)}.json`; a.click(); 
}

function triggerImport() { document.getElementById("importFile").click(); }
function importData(e) { 
    const t = i18n[currentLang]; const file = e.target.files[0]; if (!file) return; 
    const reader = new FileReader(); 
    reader.onload = function(evt) { 
        try { const json = JSON.parse(evt.target.result); localStorage.setItem(STORAGE_KEY, JSON.stringify(json)); alert(t.alertBackupDone); location.reload(); } 
        catch(err) { alert(t.alertBackupFail); } 
    }; 
    reader.readAsText(file); 
}

function getNamesFromContentEditable(id) {
    const el = document.getElementById(id); if(!el) return [];
    let html = el.innerHTML;
    html = html.replace(/<div[^>]*>/gi, '\n').replace(/<\/div>/gi, '\n').replace(/<p[^>]*>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<br\s*[\/]?>/gi, '\n');
    let text = html.replace(/<[^>]+>/g, ''); return text.split(/\n/).map(s => s.trim()).filter(s => s !== "");
}
function updateContentEditable(id, arr) { const el = document.getElementById(id); if(el) el.innerHTML = arr.map(name => `<div>${name}</div>`).join(''); }

window.quickStart = function(name) { let tIdx = timers.findIndex(t => t.student === name); if (tIdx !== -1) startTimer(tIdx); };
window.quickFinish = function(name) { let tIdx = timers.findIndex(t => t.student === name); if (tIdx !== -1) finishSession(tIdx); };

function addGuest() { const input = document.getElementById('guestNameInput'); const name = input.value.trim(); if (!name) return; if (studentLevels[name] || guestList.includes(name)) { alert("이미 명단에 있는 이름입니다."); return; } guestList.push(name); customStudentOrder.push(name); input.value = ''; playUISound('click'); generateStudents(); }
window.removeGuest = function(name) { if(confirm(`게스트 '${name}' 학생을 명단에서 완전히 삭제하시겠습니까?`)) { guestList = guestList.filter(g => g !== name); customStudentOrder = customStudentOrder.filter(g => g !== name); if(finishedSet.has(name)) finishedSet.delete(name); playUISound('cancel'); generateStudents(); } };
window.cancelFromCard = function(name) { let tIdx = timers.findIndex(t => t.student === name); if (tIdx !== -1) cancelSession(tIdx); };

// ⭐ 레벨 태그(level-tag) 제거됨, 시작/종료 버튼 아이콘 제거됨
function generateStudents() {
    document.getElementById("grid-unassigned").innerHTML = "";
    document.getElementById("grid-active").innerHTML = "";
    document.getElementById("grid-finished").innerHTML = "";

    studentLevels = {}; 
    const levels = ['PRE', 'BASIC', 'INTER', 'ADV', 'PREP'];
    const tLang = i18n[currentLang];
    let allNames = [];

    levels.forEach(lvl => { const names = getNamesFromContentEditable("studentInput_" + lvl); names.forEach(n => { studentLevels[n] = lvl; allNames.push(n); }); });
    guestList.forEach(n => { studentLevels[n] = 'GUEST'; allNames.push(n); });

    let newOrder = [];
    customStudentOrder.forEach(name => { if(allNames.includes(name)) newOrder.push(name); });
    allNames.forEach(name => { if(!newOrder.includes(name)) newOrder.push(name); });
    customStudentOrder = newOrder;
    allNames = customStudentOrder;

    allNames.forEach((n, index) => {
        const lvl = studentLevels[n];
        const btn = document.createElement("button"); btn.id = "btn-" + n; 
        
        btn.innerHTML = `
            <div class="gauge-bg"></div>
            <button class="card-cancel-btn" onclick="event.stopPropagation(); cancelFromCard('${n}')">✖</button>
            <button class="guest-delete-btn" onclick="event.stopPropagation(); removeGuest('${n}')">✖</button>
            <div class="alarm-alert-text">${tLang.statusTimeUp}</div>
            <span class="name-text">${n}</span>
            <div class="quick-controls">
                <button class="quick-btn q-start" onclick="event.stopPropagation(); quickStart('${n}')">${tLang.quickStart}</button>
                <button class="quick-btn q-finish" onclick="event.stopPropagation(); quickFinish('${n}')">${tLang.quickFinish}</button>
            </div>
        `;
        btn.draggable = true; 
        btn.style.order = index;

        btn.ondragstart = (e) => { draggedName = n; draggedNameForList = n; draggedFromIndex = null; e.dataTransfer.effectAllowed = 'move'; playUISound('click'); };
        btn.ondragenter = (e) => { e.preventDefault(); btn.classList.add("drag-over"); };
        btn.ondragover = (e) => { e.preventDefault(); btn.classList.add("drag-over"); };
        btn.ondragleave = (e) => { btn.classList.remove("drag-over"); };
        
        btn.ondrop = (e) => {
            e.preventDefault(); btn.classList.remove("drag-over");
            if (draggedFromIndex !== null) return; 
            if (draggedNameForList && draggedNameForList !== n) {
                let i1 = customStudentOrder.indexOf(draggedNameForList);
                let i2 = customStudentOrder.indexOf(n);
                if (i1 > -1 && i2 > -1) {
                    let temp = customStudentOrder[i1];
                    customStudentOrder[i1] = customStudentOrder[i2];
                    customStudentOrder[i2] = temp;
                    playUISound('click'); 
                    generateStudents(); 
                }
            }
        };

        btn.onclick = () => { 
            btn.classList.add("clicked"); setTimeout(() => btn.classList.remove("clicked"), 150);
            if (attendanceMap.has(n)) { 
                goToTimer(n);
            } 
            else { 
                if (finishedSet.has(n)) finishedSet.delete(n); 
                const emptyIdx = timers.findIndex(t => t.student === "(empty)"); 
                if (emptyIdx !== -1) handleDropOnTimer(n, emptyIdx, null); 
            }
        };
        
        document.getElementById("grid-unassigned").appendChild(btn); 
        updateStudentStatus(n);
    });
    
    timers.forEach((t, idx) => { if(t.student !== "(empty)") { updateGauge(t.student, t.remainingTime, t.totalTime); updateBoxUI(idx); } }); 
    saveToStorage();
}

// ⭐ 수업중 텍스트 배지 제거, 시작 시간 배지 띄우기
function updateStudentStatus(name) {
    const tLang = i18n[currentLang];
    const btn = document.getElementById("btn-" + name); if (!btn) return;
    const lvl = studentLevels[name] || '';
    
    btn.className = `student-btn level-${lvl}`; 
    
    let badge = btn.querySelector(".status-badge");
    if (!badge) { badge = document.createElement("div"); badge.className = "status-badge"; btn.appendChild(badge); }
    badge.style.background = ""; badge.style.color = "";
    badge.style.display = ""; 
    
    let timeBadge = btn.querySelector(".start-time-badge");
    if (!timeBadge) { 
        timeBadge = document.createElement("div"); 
        timeBadge.className = "start-time-badge"; 
        timeBadge.title = "클릭하여 시작 시간 수정";
        btn.appendChild(timeBadge); 
    }
    timeBadge.style.display = "none"; 

    const gridUnassigned = document.getElementById("grid-unassigned");
    const gridActive = document.getElementById("grid-active");
    const gridFinished = document.getElementById("grid-finished");

    if (finishedSet.has(name)) { 
        btn.classList.add("finished"); badge.innerHTML = tLang.statusFinish;
        gridFinished.appendChild(btn);
    } else {
        let t = timers.find(x => x.student === name);
        if (t) {
            if (t.isOver) { 
                btn.classList.add("alarm-blink", "attended"); badge.innerHTML = tLang.statusTimeUp; 
                badge.style.background = "var(--brand-danger)"; badge.style.color = "white"; 
            } else if (t.interval) { 
                btn.classList.add("playing", "attended"); 
                
                // 기존 수업중 배지는 완전히 숨깁니다
                badge.style.display = "none"; 
                
                // 시간이 있으면 시간 배지 표시
                if(t.startTimeStr) {
                    timeBadge.innerHTML = `⏰ ${t.startTimeStr}`;
                    timeBadge.style.display = "block";
                    timeBadge.onclick = (e) => {
                        e.stopPropagation();
                        editActiveStartTime(name);
                    };
                }

            } else { 
                btn.classList.add("attended"); badge.innerHTML = tLang.statusAssign; 
                badge.style.background = "var(--brand-success)"; badge.style.color = "white"; 
            }
            gridActive.appendChild(btn);
        } else { 
            badge.remove(); 
            timeBadge.remove(); 
            gridUnassigned.appendChild(btn);
        }
    }
}

// ⭐ 커스텀 시간 입력 팝업창
let timePromptCallback = null;

function showTimePrompt(title, defaultTime, callback) {
    playUISound('click');
    let overlay = document.getElementById('custom-time-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'custom-time-modal-overlay';
        overlay.onclick = (e) => { if(e.target === overlay) closeTimePrompt(false); };
        
        overlay.innerHTML = `
            <div class="custom-time-modal">
                <h3 id="time-modal-title">시간 수정</h3>
                <input type="time" id="time-modal-input" required>
                <div class="modal-btns">
                    <button class="btn-modal-cancel" onclick="closeTimePrompt(false)">취소</button>
                    <button class="btn-modal-save" onclick="closeTimePrompt(true)">저장</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    document.getElementById('time-modal-title').innerText = title;
    
    if(!defaultTime) {
        const now = new Date();
        defaultTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }
    document.getElementById('time-modal-input').value = defaultTime;
    timePromptCallback = callback;
    
    requestAnimationFrame(() => { overlay.classList.add('show'); });
}

window.closeTimePrompt = function(isSave) {
    const overlay = document.getElementById('custom-time-modal-overlay');
    overlay.classList.remove('show');
    playUISound('click');
    
    if (isSave) {
        const newTime = document.getElementById('time-modal-input').value;
        if (timePromptCallback && newTime) timePromptCallback(newTime);
    }
    timePromptCallback = null;
}

window.editActiveStartTime = function(name) {
    let tIdx = timers.findIndex(t => t.student === name);
    if(tIdx === -1) return;
    let t = timers[tIdx];

    showTimePrompt(`[${name}] 수업 시작 시간`, t.startTimeStr, function(newTime) {
        t.startTimeStr = newTime; 
        
        let logItem = logLeftItems.find(item => item.student === name && item.type === 'start');
        if(logItem) {
            logItem.time = newTime;
            renderLogs();
        }
        updateStudentStatus(name); 
        saveToStorage();
    });
};

function createInitialGrid() {
    const grid = document.getElementById("grid"); grid.innerHTML = "";
    for (let i = 0; i < DESK_COUNT; i++) {
        const box = document.createElement("div"); box.id = `box-${i}`; box.className = "timer-box";
        box.ondragenter = (e) => { e.preventDefault(); box.classList.add("drag-over"); };
        box.ondragover = (e) => { e.preventDefault(); box.classList.add("drag-over"); };
        box.ondragleave = (e) => { box.classList.remove("drag-over"); };
        box.ondrop = (e) => { e.preventDefault(); box.classList.remove("drag-over"); handleDropOnTimer(draggedName, i, draggedFromIndex); };
        grid.appendChild(box); updateBoxUI(i);
    }
}

function updateBoxUI(id) {
    const tLang = i18n[currentLang];
    const t = timers[id]; const box = document.getElementById(`box-${id}`); if (!box) return;
    const isAssigned = t.student !== "(empty)";
    const isPlaying = t.interval !== null;
    box.className = `timer-box ${t.isOver ? 'done' : ''} ${isPlaying ? 'playing' : ''}`;
    
    const lvl = studentLevels[t.student] || '';
    const panelClass = isAssigned && lvl ? `info-panel timer-bg-${lvl}` : 'info-panel';

    const panelStyle = isAssigned ? "" : "background: transparent; border: 2px dashed var(--border); box-shadow: none !important;";
    const nameDisplay = isAssigned ? t.student : '&nbsp;';
    const numDisplay = String(id+1).padStart(2, '0');

    box.innerHTML = `
        <div class="desk-id" style="opacity: ${isAssigned ? '1' : '0.4'}">${numDisplay}</div>
        <div class="${panelClass}" draggable="${isAssigned}" style="${panelStyle}">
            <div class="student-name-display" ${isAssigned ? `style="cursor:pointer;" onclick="playUISound('tab'); switchView('roster');"` : ''}>${nameDisplay}</div>
            <div class="time-display" id="display-${id}" style="visibility: ${isAssigned ? 'visible' : 'hidden'}">${t.isOver ? '+'+formatTime(t.overTime) : formatTime(t.remainingTime)}</div>
        </div>
        
        <div class="time-controls">
            <button class="time-btn btn-3d-sm" onclick="adjustTime(${id}, 3000)">+50</button>
            <button class="time-btn btn-3d-sm" onclick="adjustTime(${id}, 600)">+10</button>
            <button class="time-btn btn-3d-sm" onclick="adjustTime(${id}, 300)">+05</button>
            <button class="time-btn btn-3d-sm" onclick="adjustTime(${id}, 60)">+01</button>
            <button class="time-btn btn-3d-sm minus" onclick="adjustTime(${id}, -600)">-10</button>
            <button class="time-btn btn-3d-sm minus" onclick="adjustTime(${id}, -300)">-05</button>
            <button class="time-btn btn-3d-sm minus" onclick="adjustTime(${id}, -60)">-01</button>
            <button class="time-btn btn-3d-sm clear" onclick="clearTime(${id})">${tLang.btnClear}</button>
        </div>
        
        <div class="action-btn-row">
            <button class="action-btn btn-start" onclick="startTimer(${id})">${tLang.btnStart}</button>
        </div>
        
        <div class="action-btn-row">
            <button class="action-btn btn-stop" onclick="stopTimer(${id})">${tLang.btnStop}</button>
            <button class="action-btn btn-cancel" onclick="cancelSession(${id})">${tLang.btnCancel}</button>
        </div>
        
        <div class="action-btn-row">
            <button class="action-btn btn-finish" onclick="finishSession(${id})">${tLang.btnFinish}</button>
        </div>
    `;
    const infoPanel = box.querySelector('.info-panel');
    infoPanel.ondragstart = (e) => { if(isAssigned) { draggedName = t.student; draggedFromIndex = id; draggedNameForList = null; e.dataTransfer.effectAllowed = 'move'; } else { e.preventDefault(); } };
}

function handleDropOnTimer(name, targetIdx, fromIdx) {
    if (fromIdx === targetIdx) return;
    if (fromIdx !== null) {
        stopTimer(fromIdx); stopTimer(targetIdx);
        const fData = { ...timers[fromIdx] }; const tData = { ...timers[targetIdx] };
        timers[targetIdx] = { ...fData, interval: null }; timers[fromIdx] = { ...tData, interval: null };
        updateBoxUI(fromIdx); updateBoxUI(targetIdx); updateStudentStatus(timers[fromIdx].student); updateStudentStatus(timers[targetIdx].student); playUISound('assign');
    } else {
        let alreadyIdx = timers.findIndex(t => t.student === name); if(alreadyIdx !== -1) resetTimerData(alreadyIdx, false);
        timers[targetIdx].student = name; timers[targetIdx].remainingTime = 3000; timers[targetIdx].totalTime = 3000;
        if (!attendanceMap.has(name)) { assignOrderCounter++; attendanceMap.set(name, assignOrderCounter); if(finishedSet.has(name)) finishedSet.delete(name); }
        playUISound('assign'); updateBoxUI(targetIdx); updateStudentStatus(name); updateGauge(name, 3000, 3000);
    }
    saveToStorage();
}

function startTimer(id) {
    const target = timers[id]; if (target.interval || target.student === "(empty)") return;
    initAudio(); playUISound('start'); 
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    target.startTimeStr = timeStr;
    
    logEvent(target.student, 'start', 'left', 0, timeStr); 
    
    target.lastTick = Date.now();
    
    target.interval = setInterval(() => {
        const nowTick = Date.now(); const delta = Math.floor((nowTick - target.lastTick) / 1000);
        if (delta >= 1) {
            target.lastTick = nowTick - ((nowTick - target.lastTick) % 1000);
            if (target.remainingTime > 0) {
                target.remainingTime = Math.max(0, target.remainingTime - delta); 
                updateGauge(target.student, target.remainingTime, target.totalTime); 
                document.getElementById(`display-${id}`).innerText = formatTime(target.remainingTime);
                if (target.remainingTime === 0 && !target.isOver) triggerAlarm(id);
            } else {
                if (!target.isOver) triggerAlarm(id); 
                target.overTime += delta; document.getElementById(`display-${id}`).innerText = "+" + formatTime(target.overTime);
                if (target.overTime >= 300) { finishSession(id); }
            }
            saveToStorage(); 
        }
    }, 250);
    
    updateStudentStatus(target.student); 
    updateBoxUI(id);
}

function resumeTimer(id) {
    const target = timers[id]; if (target.interval || target.student === "(empty)") return;
    
    target.interval = setInterval(() => {
        const nowTick = Date.now(); const delta = Math.floor((nowTick - target.lastTick) / 1000);
        if (delta >= 1) {
            target.lastTick = nowTick - ((nowTick - target.lastTick) % 1000);
            if (target.remainingTime > 0) {
                target.remainingTime = Math.max(0, target.remainingTime - delta); 
                updateGauge(target.student, target.remainingTime, target.totalTime); 
                document.getElementById(`display-${id}`).innerText = formatTime(target.remainingTime);
                if (target.remainingTime === 0 && !target.isOver) triggerAlarm(id);
            } else {
                if (!target.isOver) triggerAlarm(id); 
                target.overTime += delta; document.getElementById(`display-${id}`).innerText = "+" + formatTime(target.overTime);
                if (target.overTime >= 300) { finishSession(id); }
            }
            saveToStorage(); 
        }
    }, 250);
    
    updateStudentStatus(target.student); 
    updateBoxUI(id);
}

function stopTimer(id) { 
    if (timers[id].interval) { 
        clearInterval(timers[id].interval); timers[id].interval = null; playUISound('stop'); 
        updateStudentStatus(timers[id].student); 
        updateBoxUI(id);
        saveToStorage(); 
    } 
}

function clearTime(id) { playUISound('cancel'); timers[id].remainingTime = 0; timers[id].totalTime = 0; timers[id].overTime = 0; timers[id].isOver = false; stopTimer(id); updateBoxUI(id); updateGauge(timers[id].student, 0, 1); saveToStorage(); }
function cancelSession(id) { if(timers[id].student === "(empty)") return; playUISound('cancel'); const sn = timers[id].student; attendanceMap.delete(sn); resetTimerData(id, true); }
function finishSession(id) { if(timers[id].student === "(empty)") return; playUISound('finish'); const sn = timers[id].student; finishedSet.add(sn); attendanceMap.delete(sn); logEvent(sn, 'finish', 'right', timers[id].overTime); resetTimerData(id, true); }

function resetTimerData(id, resetUI) { stopTimer(id); const sn = timers[id].student; timers[id] = { student: "(empty)", remainingTime: 0, totalTime: 0, overTime: 0, interval: null, isOver: false, lastTick: 0 }; updateBoxUI(id); if (resetUI) updateStudentStatus(sn); saveToStorage(); }
function adjustTime(id, sec) { 
    playUISound('click'); 
    timers[id].remainingTime = Math.max(0, timers[id].remainingTime + sec); 
    if(timers[id].remainingTime > timers[id].totalTime || timers[id].totalTime === 0) { timers[id].totalTime = timers[id].remainingTime; } 
    if(timers[id].remainingTime > 0) { timers[id].isOver = false; timers[id].overTime = 0; updateStudentStatus(timers[id].student); } 
    updateBoxUI(id); updateGauge(timers[id].student, timers[id].remainingTime, timers[id].totalTime); 
    saveToStorage(); 
}
function updateGauge(studentName, remaining, total) { const btn = document.getElementById("btn-" + studentName); if (!btn) return; const gauge = btn.querySelector(".gauge-bg"); if (!gauge || total <= 0) return; gauge.style.width = (((total - remaining) / total) * 100) + "%"; }
function formatTime(t) { return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; }

// ==========================================
// 7. AUDIO & TTS (⭐ 한국어와 영어 쪼개서 읽기)
// ==========================================
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function triggerAlarm(id) { timers[id].isOver = true; updateStudentStatus(timers[id].student); updateBoxUI(id); let melodyType = parseInt(document.getElementById("melodyType").value); playMelody(melodyType); playAlarmTTS(timers[id].student); }
window.__tts_queue = []; 
if (window.speechSynthesis) { window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); }; window.speechSynthesis.getVoices(); }

function playAlarmTTS(studentName) {
    return new Promise(resolve => {
        const voiceType = document.getElementById("ttsVoiceSelect").value;
        if (voiceType === "0" || !window.speechSynthesis) return resolve();
        let voices = window.speechSynthesis.getVoices(); 
        if (voices.length === 0) { setTimeout(() => playAlarmTTS(studentName).then(resolve), 100); return; }

        window.speechSynthesis.cancel(); 

        const getKoVoice = () => voices.find(v => v.name.includes('Google') && v.lang.includes('ko')) ||
                      voices.find(v => v.name.includes('Natural') && v.lang.includes('ko') && !v.name.includes('Male') && !v.name.includes('InJoon')) ||
                      voices.find(v => v.lang.includes('ko-KR') && (v.name.includes('Female') || v.name.includes('여성') || v.name.includes('Heami'))) ||
                      voices.find(v => v.lang.includes('ko') && !v.name.includes('Male') && !v.name.includes('남성')) ||
                      voices.find(v => v.lang.includes('ko'));

        const getEnVoice = () => voices.find(v => v.name === 'Google US English') ||
                      voices.find(v => v.name.includes('Google') && v.lang.includes('en')) ||
                      voices.find(v => v.name.includes('Natural') && v.lang.includes('en') && !v.name.includes('Male') && !v.name.includes('Guy')) ||
                      voices.find(v => v.lang.includes('en-US') && (v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Female'))) ||
                      voices.find(v => v.lang.includes('en') && !v.name.includes('Male') && !v.name.includes('Guy')) ||
                      voices.find(v => v.lang.includes('en'));

        if (voiceType === "1") { 
            let u = new SpeechSynthesisUtterance(`${studentName}! ${studentName}!`); 
            u.volume = ttsVolume; u.rate = 1.05; u.pitch = 1.1; u.lang = 'ko-KR'; 
            let koVoice = getKoVoice();
            if (koVoice) u.voice = koVoice; 
            u.onend = resolve; u.onerror = resolve; 
            window.__tts_queue.push(u); window.speechSynthesis.speak(u);
        } 
        else if (voiceType === "2" || voiceType === "3") { 
            let u1 = new SpeechSynthesisUtterance(`${studentName}!`);
            u1.volume = ttsVolume; u1.rate = 1.05; u1.pitch = 1.1; u1.lang = 'ko-KR';
            let koVoice = getKoVoice();
            if (koVoice) u1.voice = koVoice;
            
            let phrase = voiceType === "2" ? "Let's go home!" : "Time's up! It's time to go home!";
            let u2 = new SpeechSynthesisUtterance(phrase);
            u2.volume = ttsVolume; u2.rate = 1.05; u2.pitch = 1.1; u2.lang = 'en-US';
            let enVoice = getEnVoice();
            if (enVoice) u2.voice = enVoice;
            
            u2.onend = resolve; u2.onerror = resolve; 
            
            window.__tts_queue.push(u1); window.__tts_queue.push(u2);
            window.speechSynthesis.speak(u1); window.speechSynthesis.speak(u2);
        }
    });
}

function playMelody(type) {
    return new Promise(resolve => {
        initAudio();
        const melodies = [ 
            [523.25, 659.25, 783.99, 1046.50], [440, 554.37, 659.25, 880], [880, 880, 880, 880], [392, 329.63, 261.63], [261.63, 392, 523.25, 783.99], 
            [1046.5, 0, 1046.5, 0, 1046.5], [1046.5, 1174.66, 1318.51, 1567.98], [130.81, 196.00], [587.33, 739.99, 880], [440, 349.23, 523.25, 493.88], 
            [659.25, 523.25, 659.25, 523.25], [392, 440, 493.88, 523.25, 587.33], [1046.5, 783.99, 523.25], [440, 440, 0, 440, 440], [523.25, 392, 329.63, 261.63], 
            [880, 659.25, 880, 659.25], [261.63, 329.63, 392, 523.25, 659.25], [783.99, 587.33, 440, 349.23], [1046.5, 1046.5, 1046.5, 1046.5, 1046.5], [523.25, 659.25, 587.33, 698.46, 659.25, 783.99],
            [330, 261, 293, 196, 0, 196, 293, 330, 261], [659, 622, 659, 622, 659, 494, 587, 523, 440], [523, 659, 784, 1046], [392, 330, 0, 392, 330], [1046, 0, 1046, 0, 1046, 0, 1046, 0, 1046] 
        ];
        let notes = melodies[type] || melodies[0]; let now = audioCtx.currentTime; let noteLength = 0.25; 
        if(type === 2 || type === 5 || type === 13 || type === 18 || type === 24) noteLength = 0.15;
        if(type === 20 || type === 21 || type === 22) noteLength = 0.35;

        notes.forEach((freq, i) => {
            if (freq === 0) return;
            let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain();
            osc.type = (type === 2 || type === 9 || type === 18 || type === 24) ? 'square' : 'sine'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, now + i*noteLength); gain.gain.linearRampToValueAtTime(alarmVolume, now + i*noteLength + 0.02); gain.gain.exponentialRampToValueAtTime(0.01, now + i*noteLength + noteLength);
            osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now + i*noteLength); osc.stop(now + i*noteLength + noteLength);
        });
        setTimeout(resolve, notes.length * noteLength * 1000 + 200);
    });
}

function playUISound(type) {
    if (!audioCtx) initAudio();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination); const now = audioCtx.currentTime; let v = uiVolume; if (v === 0) return;
    if (type === 'tab' || type === 'click') {
        let st = parseInt(document.getElementById('uiSoundType').value) || 0;
        if(st === 0) { osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.1); gain.gain.setValueAtTime(v * 0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
        else if(st === 1) { osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(450, now + 0.05); gain.gain.setValueAtTime(v * 0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05); osc.start(now); osc.stop(now + 0.05); }
        else if(st === 2) { osc.type = 'triangle'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1000, now + 0.03); gain.gain.setValueAtTime(v * 0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03); osc.start(now); osc.stop(now + 0.03); }
        else if(st === 3) { osc.type = 'sine'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(150, now + 0.1); gain.gain.setValueAtTime(v * 0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
        else if(st === 4) { osc.type = 'square'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08); gain.gain.setValueAtTime(v * 0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08); osc.start(now); osc.stop(now + 0.08); }
        else if(st === 5) { osc.type = 'sine'; osc.frequency.setValueAtTime(2000, now); osc.frequency.exponentialRampToValueAtTime(2500, now + 0.02); gain.gain.setValueAtTime(v * 0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02); osc.start(now); osc.stop(now + 0.02); }
        else if(st === 6) { osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(200, now + 0.06); gain.gain.setValueAtTime(v * 0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06); osc.start(now); osc.stop(now + 0.06); }
        else if(st === 7) { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(850, now + 0.1); gain.gain.setValueAtTime(v * 0.08, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
        else if(st === 8) { osc.type = 'sine'; osc.frequency.setValueAtTime(500, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.15); gain.gain.setValueAtTime(v * 0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); osc.start(now); osc.stop(now + 0.15); }
        else if(st === 9) { osc.type = 'sine'; osc.frequency.setValueAtTime(1500, now); osc.frequency.exponentialRampToValueAtTime(1800, now + 0.2); gain.gain.setValueAtTime(v * 0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2); osc.start(now); osc.stop(now + 0.2); }
    } else if (type === 'assign') { osc.type = 'triangle'; osc.frequency.setValueAtTime(880, now); gain.gain.setValueAtTime(v * 0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); osc.start(now); osc.stop(now + 0.15); } 
    else if (type === 'start') { osc.type = 'square'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now + 0.1); gain.gain.setValueAtTime(v * 0.08, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); } 
    else if (type === 'stop') { osc.type = 'square'; osc.frequency.setValueAtTime(880, now); osc.frequency.linearRampToValueAtTime(440, now + 0.1); gain.gain.setValueAtTime(v * 0.08, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); } 
    else if (type === 'finish') { osc.type = 'sine'; osc.frequency.setValueAtTime(1046.5, now); gain.gain.setValueAtTime(v * 0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); } 
    else if (type === 'cancel') { osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(150, now + 0.2); gain.gain.setValueAtTime(v * 0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2); osc.start(now); osc.stop(now + 0.2); }
}

let lastTestTime = 0; let ttsTimeout = null;
function previewMelody() { playUISound('click'); let melodyType = parseInt(document.getElementById("melodyType").value); playMelody(melodyType); }
function previewRealtime(type) {
    const now = Date.now();
    if (type === 'alarm') { if (now - lastTestTime > 150) { lastTestTime = now; initAudio(); let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain(); osc.type = 'sine'; osc.frequency.value = 880; gain.gain.value = alarmVolume; osc.connect(gain); gain.connect(audioCtx.destination); osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.1); } } 
    else if (type === 'ui') { if (now - lastTestTime > 150) { lastTestTime = now; playUISound('click'); } } 
    else if (type === 'tts') { clearTimeout(ttsTimeout); ttsTimeout = setTimeout(() => { playAlarmTTS("Test"); }, 300); }
}

// ==========================================
// 8. LOGGING & UTILITIES
// ==========================================
function logEvent(student, type, side, overTime = 0, forceTime = null) {
    const now = new Date(); 
    const timeStr = forceTime || `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const obj = { time: timeStr, student: student, type: type, overTime: overTime };
    if (side === 'left') logLeftItems.unshift(obj); else logRightItems.unshift(obj);
    renderLogs(); saveToStorage();
}

function renderLogs() { 
    const t = i18n[currentLang];
    const renderItem = (item, index, side) => {
        if (typeof item === 'string') return `<div style="margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:5px;">${item}</div>`;
        let actionText = "";
        if (item.type === 'start') actionText = `▶️ ${item.student} ${t.logStartWord}`;
        else if (item.type === 'finish') { const extraStr = item.overTime > 0 ? ` (+${formatTime(item.overTime)})` : ""; actionText = `🏁 ${item.student} ${t.logFinishWord}${extraStr}`; }
        else if (item.type === 'game') actionText = `🎉 <span style="color:var(--accent); font-weight:900;">[이벤트 당첨] ${item.student}</span>`;
        
        return `<div style="margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:5px;">[<span class="editable-log-time" onclick="editLogTime('${side}', ${index})" style="cursor:pointer; text-decoration:underline;" title="클릭하여 시간 수정">${item.time}</span>] ${actionText}</div>`;
    };
    
    document.getElementById("log-left").innerHTML = logLeftItems.map((item, idx) => renderItem(item, idx, 'left')).join(''); 
    document.getElementById("log-right").innerHTML = logRightItems.map((item, idx) => renderItem(item, idx, 'right')).join(''); 
}

window.editLogTime = function(side, index) {
    const list = (side === 'left') ? logLeftItems : logRightItems;
    const item = list[index];

    if (!item || typeof item === 'string') return;

    let title = item.type === 'start' ? `[${item.student}] 시작 시간 수정` : `[${item.student}] 종료 시간 수정`;

    showTimePrompt(title, item.time, function(newTime) {
        item.time = newTime;
        
        if(item.type === 'start') {
            let tIdx = timers.findIndex(t => t.student === item.student);
            if(tIdx !== -1) timers[tIdx].startTimeStr = newTime;
            updateStudentStatus(item.student);
        }
        
        renderLogs();
        saveToStorage();
    });
};

function saveLogAction() { 
    const t = i18n[currentLang]; const now = new Date(); const dateString = `${now.getFullYear()}. ${now.getMonth()+1}. ${now.getDate()} (${t.days[now.getDay()]})`;
    const formatLogTxt = (item) => {
        if(typeof item === 'string') return item;
        let actionText = "";
        if (item.type === 'start') actionText = `▶️ ${item.student} ${t.logStartWord}`;
        else if (item.type === 'finish') actionText = `🏁 ${item.student} ${t.logFinishWord}${item.overTime > 0 ? ' (+'+formatTime(item.overTime)+')' : ''}`;
        else if (item.type === 'game') actionText = `🎉 [이벤트 당첨] ${item.student}`;
        return `[${item.time}] ${actionText}`;
    };
    const leftTxt = logLeftItems.length > 0 ? logLeftItems.map(formatLogTxt).join('\n') : t.noRecords;
    const rightTxt = logRightItems.length > 0 ? logRightItems.map(formatLogTxt).join('\n') : t.noRecords;
    const logText = `=========================================\n🏫 Academy : ${academyName}\n📚 Class : ${className}\n📅 Date : ${dateString}\n=========================================\n\n--- ▶️ START ---\n${leftTxt}\n\n--- 🏁 FINISH ---\n${rightTxt}\n`;
    const blob = new Blob([logText], {type:'text/plain'}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); const fileNameDate = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`; a.download = `${academyName}_${className}_LOG_${fileNameDate}.txt`; a.click(); 
}

function askSoftReset() { 
    const t = i18n[currentLang]; playUISound('click'); 
    if(confirm(t.alertSoft)) { 
        timers.forEach((t, i) => stopTimer(i)); 
        timers = Array.from({length: DESK_COUNT}, () => ({ student: "(empty)", remainingTime: 0, totalTime: 0, overTime: 0, interval: null, isOver: false, lastTick: 0 })); 
        logLeftItems = []; logRightItems = []; attendanceMap.clear(); finishedSet.clear(); assignOrderCounter = 0; guestList = [];
        renderLogs(); for(let i=0; i<DESK_COUNT; i++) updateBoxUI(i); generateStudents(); saveToStorage(); alert(t.alertResetDone); 
    } 
}

function askFactoryReset() { 
    const t = i18n[currentLang]; playUISound('click'); 
    if(confirm(t.alertHard)) { localStorage.removeItem(STORAGE_KEY); alert(t.alertFactoryDone); location.reload(); } 
}

// ==========================================
// 9. LADDER & ROULETTE GAME LOGIC
// ==========================================
let ladderPlayers = [];
let ladderRungs = [];
let targetWinnerIndex = -1;
let animReq;
let isResultRevealed = false; 
let isGameAnimating = false;

const ladderColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1', '#14b8a6', '#d946ef', '#eab308', '#0ea5e9', '#f43f5e'];

let isBgmOn = true;
let ladderBgmTimer = null;

function toggleBGM() {
    isBgmOn = !isBgmOn;
    const btn = document.getElementById('btnBgmToggle');
    if(isBgmOn) {
        btn.innerText = "🔊 BGM ON";
        btn.style.color = "var(--text-main)";
    } else {
        btn.innerText = "🔇 BGM OFF";
        btn.style.color = "var(--text-muted)";
    }
    playUISound('click');

    if (isGameAnimating) {
        if (isBgmOn) startLadderBGM();
        else stopLadderBGM();
    }
}

function startLadderBGM() {
    if(!isBgmOn) return;
    initAudio();
    let tick = 0;
    const notes = [523.25, 659.25, 783.99, 587.33, 659.25, 523.25]; 
    ladderBgmTimer = setInterval(() => {
        if(!audioCtx) return;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = notes[tick % notes.length];
        gain.gain.setValueAtTime(uiVolume * 0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        tick++;
    }, 150); 
}

function stopLadderBGM() {
    if(ladderBgmTimer) {
        clearInterval(ladderBgmTimer);
        ladderBgmTimer = null;
    }
}

function setupLadder() {
    playUISound('click');
    
    if(animReq) {
        cancelAnimationFrame(animReq);
        animReq = null;
    }
    stopLadderBGM();
    isGameAnimating = false;

    const canvas = document.getElementById('ladderCanvas');
    const ctx = canvas.getContext('2d');
    
    ladderPlayers = timers.filter(t => t.student !== "(empty)").map(t => t.student);
    document.getElementById('gameResult').innerHTML = "";
    
    const btnStart = document.getElementById('btnStartLadder');
    btnStart.innerText = "🚀 사다리 타기 시작!";
    btnStart.onclick = startLadderAnimation;
    btnStart.style.display = 'none';

    if(ladderPlayers.length < 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted');
        ctx.font = "bold 20px Pretendard";
        ctx.textAlign = "center";
        ctx.fillText("최소 2명 이상의 수업 중인 학생이 필요합니다.", canvas.width/2, canvas.height/2);
        return;
    }

    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    generateLadderData();
    isResultRevealed = false; 
    drawStaticLadder();
    
    btnStart.style.display = 'block';
}

function generateLadderData() {
    ladderRungs = [];
    const cols = ladderPlayers.length;
    targetWinnerIndex = Math.floor(Math.random() * cols);
    
    const h = document.getElementById('ladderCanvas').height;
    const ySteps = Math.floor(Math.random() * 6) + 12; 
    const yGap = (h - 120) / ySteps;
    
    for(let i=1; i<ySteps; i++) {
        let baseY = 60 + (i * yGap);
        let usedCols = new Set();
        let numRungs = Math.floor(Math.random() * (cols / 1.5)) + 1;
        
        for(let j=0; j<numRungs; j++) {
            let c = Math.floor(Math.random() * (cols - 1));
            if(!usedCols.has(c) && !usedCols.has(c+1)) {
                usedCols.add(c);
                usedCols.add(c+1);
                
                let isDiagonal = Math.random() < 0.45; 
                let tilt = Math.random() * 40 - 20; 
                let yLeft = baseY + (Math.random() * 10 - 5);
                let yRight = isDiagonal ? (yLeft + tilt) : yLeft;
                
                ladderRungs.push({col: c, yLeft: yLeft, yRight: yRight});
            }
        }
    }
    ladderRungs.sort((a,b) => a.yLeft - b.yLeft);
}

function drawStaticLadder() {
    const canvas = document.getElementById('ladderCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width; const h = canvas.height;
    const cols = ladderPlayers.length;
    const spacing = w / cols;
    
    ctx.clearRect(0, 0, w, h);
    
    const lineColor = getComputedStyle(document.body).getPropertyValue('--border').trim();
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent').trim();

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    
    ctx.strokeStyle = lineColor;
    for(let i=0; i<cols; i++) {
        let x = (i + 0.5) * spacing;
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, h - 40);
        ctx.stroke();
    }
    
    for(let i=0; i<ladderRungs.length; i++) {
        let r = ladderRungs[i];
        let x1 = (r.col + 0.5) * spacing;
        let x2 = (r.col + 1.5) * spacing;
        ctx.beginPath();
        ctx.moveTo(x1, r.yLeft);
        ctx.lineTo(x2, r.yRight);
        ctx.stroke();
    }
    
    ctx.font = "bold 18px Pretendard";
    ctx.textAlign = "center";
    for(let i=0; i<cols; i++) {
        let x = (i + 0.5) * spacing;
        ctx.fillStyle = ladderColors[i % ladderColors.length];
        ctx.fillText(ladderPlayers[i], x, 30);
    }
    
    ctx.font = "bold 20px Pretendard";
    for(let i=0; i<cols; i++) {
        let x = (i + 0.5) * spacing;
        if(!isResultRevealed) {
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            ctx.fillText("?", x, h - 15);
        } else {
            if(i === targetWinnerIndex) {
                ctx.fillStyle = accentColor;
                ctx.fillText("🎁 당첨", x, h - 15);
            } else {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.fillText("꽝", x, h - 15);
            }
        }
    }
}

function startLadderAnimation() {
    playUISound('click');
    startLadderBGM(); 
    
    document.getElementById('btnStartLadder').style.display = 'none';
    document.getElementById('gameResult').innerHTML = "결과 확인 중...👀";
    isResultRevealed = true; 
    isGameAnimating = true;
    
    if(animReq) cancelAnimationFrame(animReq);
    
    const canvas = document.getElementById('ladderCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width; const h = canvas.height;
    const cols = ladderPlayers.length;
    const spacing = w / cols;
    const brandDanger = getComputedStyle(document.body).getPropertyValue('--brand-danger').trim();
    
    let colEvents = Array.from({length: cols}, () => []);
    ladderRungs.forEach(r => {
        colEvents[r.col].push({ yMe: r.yLeft, yTarget: r.yRight, targetCol: r.col + 1 });
        colEvents[r.col + 1].push({ yMe: r.yRight, yTarget: r.yLeft, targetCol: r.col });
    });
    colEvents.forEach(events => events.sort((a,b) => a.yMe - b.yMe));

    let paths = []; 
    for(let p=0; p<cols; p++) {
        let curCol = p;
        let curY = 40;
        let path = [{x: (curCol + 0.5) * spacing, y: curY}];
        
        while(true) {
            let nextEvent = colEvents[curCol].find(e => e.yMe > curY + 0.5);
            if(!nextEvent) {
                path.push({x: (curCol + 0.5) * spacing, y: h - 40});
                break;
            }
            path.push({x: (curCol + 0.5) * spacing, y: nextEvent.yMe});
            curCol = nextEvent.targetCol;
            curY = nextEvent.yTarget;
            path.push({x: (curCol + 0.5) * spacing, y: curY});
        }
        
        paths.push({ 
            nodes: path, 
            finalCol: curCol, 
            color: ladderColors[p % ladderColors.length] 
        });
    }
    
    let progress = 0; 
    const speed = 1.5; 
    
    paths.forEach(p => {
        let totalLen = 0;
        for(let i=0; i<p.nodes.length-1; i++) {
            let dx = p.nodes[i+1].x - p.nodes[i].x;
            let dy = p.nodes[i+1].y - p.nodes[i].y;
            totalLen += Math.sqrt(dx*dx + dy*dy);
        }
        p.totalLen = totalLen;
    });
    
    let maxLen = Math.max(...paths.map(p => p.totalLen));
    let isReplay = document.getElementById('btnStartLadder').innerText === "🎬 다시 보기";
    
    function drawFrame() {
        drawStaticLadder(); 
        progress += speed;
        
        ctx.lineWidth = 6;
        ctx.lineJoin = "round";
        
        for(let p=0; p<cols; p++) {
            let pathObj = paths[p];
            let drawnLen = 0;
            
            ctx.strokeStyle = pathObj.color;
            ctx.globalAlpha = 0.8;
            
            ctx.beginPath();
            ctx.moveTo(pathObj.nodes[0].x, pathObj.nodes[0].y);
            
            for(let i=0; i<pathObj.nodes.length-1; i++) {
                let dx = pathObj.nodes[i+1].x - pathObj.nodes[i].x;
                let dy = pathObj.nodes[i+1].y - pathObj.nodes[i].y;
                let segLen = Math.sqrt(dx*dx + dy*dy);
                
                if(drawnLen + segLen < progress) {
                    ctx.lineTo(pathObj.nodes[i+1].x, pathObj.nodes[i+1].y);
                    drawnLen += segLen;
                } else {
                    let remain = progress - drawnLen;
                    let ratio = remain / segLen;
                    ctx.lineTo(pathObj.nodes[i].x + dx*ratio, pathObj.nodes[i].y + dy*ratio);
                    drawnLen = progress;
                    break;
                }
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
        
        if(progress < maxLen) {
            animReq = requestAnimationFrame(drawFrame);
        } else {
            isGameAnimating = false; 
            stopLadderBGM(); 
            
            let winnerPathObj = paths.find(p => p.finalCol === targetWinnerIndex);
            if(winnerPathObj) {
                ctx.strokeStyle = brandDanger; 
                ctx.lineWidth = 12;
                ctx.beginPath();
                ctx.moveTo(winnerPathObj.nodes[0].x, winnerPathObj.nodes[0].y);
                for(let i=0; i<winnerPathObj.nodes.length-1; i++) {
                    ctx.lineTo(winnerPathObj.nodes[i+1].x, winnerPathObj.nodes[i+1].y);
                }
                ctx.stroke();
            }

            let realWinnerName = "";
            for(let p=0; p<cols; p++) {
                if(paths[p].finalCol === targetWinnerIndex) {
                    realWinnerName = ladderPlayers[p];
                    break;
                }
            }
            
            playUISound('finish');
            document.getElementById('gameResult').innerHTML = `🎉 축하합니다! <span style="color:var(--brand-danger)">${realWinnerName}</span> 학생이 당첨되었습니다! 🎉`;
            
            if(!isReplay) {
                logEvent(realWinnerName, 'game', 'right');
            }
            
            const btnStart = document.getElementById('btnStartLadder');
            btnStart.innerText = "🎬 다시 보기";
            btnStart.onclick = startLadderAnimation;
            btnStart.style.display = 'block';
        }
    }
    
    animReq = requestAnimationFrame(drawFrame);
}

function setupRoulette() {
    playUISound('click');
    if(animReq) { cancelAnimationFrame(animReq); animReq = null; }
    stopLadderBGM();
    rouletteSpinning = false;
    isGameAnimating = false;
    
    roulettePlayers = timers.filter(t => t.student !== "(empty)").map(t => t.student);
    document.getElementById('gameResult').innerHTML = "";
    
    const btnStart = document.getElementById('btnStartRoulette');
    btnStart.innerText = "🎡 룰렛 돌리기 시작!";
    btnStart.onclick = startRouletteAnimation;
    btnStart.style.display = 'none';

    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    
    if(roulettePlayers.length < 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted');
        ctx.font = "bold 20px Pretendard";
        ctx.textAlign = "center";
        ctx.fillText("최소 2명 이상의 수업 중인 학생이 필요합니다.", canvas.width/2, canvas.height/2);
        return;
    }

    rouletteAngle = 0;
    drawRoulette(rouletteAngle);
    btnStart.style.display = 'block';
}

function drawRoulette(angle) {
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = Math.min(cw, ch) / 2 - 25;

    ctx.clearRect(0, 0, cw, ch);

    const numSlices = roulettePlayers.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    for(let i = 0; i < numSlices; i++) {
        const startAngle = angle + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = ladderColors[i % ladderColors.length];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Pretendard";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 4;
        ctx.fillText(roulettePlayers[i], radius - 20, 0);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-card');
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent');
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 18, cy - radius - 15);
    ctx.lineTo(cx + 18, cy - radius - 15);
    ctx.lineTo(cx, cy - radius + 20);
    ctx.closePath();
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--brand-danger');
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
}

function startRouletteAnimation() {
    if(rouletteSpinning) return;
    playUISound('start');
    startLadderBGM(); 
    
    document.getElementById('btnStartRoulette').style.display = 'none';
    document.getElementById('gameResult').innerHTML = "결과 확인 중...👀";
    rouletteSpinning = true;
    isGameAnimating = true;
    
    if(animReq) cancelAnimationFrame(animReq);

    let speed = Math.random() * 0.2 + 0.4; 
    const friction = 0.993; 
    
    function spin() {
        rouletteAngle += speed;
        drawRoulette(rouletteAngle);
        speed *= friction;

        if(speed > 0.002) {
            animReq = requestAnimationFrame(spin);
        } else {
            rouletteSpinning = false;
            isGameAnimating = false;
            stopLadderBGM();
            
            const numSlices = roulettePlayers.length;
            const sliceAngle = (2 * Math.PI) / numSlices;
            
            let offsetAngle = ((3 * Math.PI / 2) - rouletteAngle) % (2 * Math.PI);
            if(offsetAngle < 0) offsetAngle += 2 * Math.PI;
            
            const winningIndex = Math.floor(offsetAngle / sliceAngle);
            const winnerName = roulettePlayers[winningIndex];

            playUISound('finish');
            document.getElementById('gameResult').innerHTML = `🎉 축하합니다! <span style="color:var(--brand-danger)">${winnerName}</span> 학생이 당첨되었습니다! 🎉`;
            
            let isReplay = document.getElementById('btnStartRoulette').innerText === "🎬 다시 돌리기";
            if(!isReplay) {
                logEvent(winnerName, 'game', 'right');
            }

            const btnStart = document.getElementById('btnStartRoulette');
            btnStart.innerText = "🎬 다시 돌리기";
            btnStart.onclick = startRouletteAnimation;
            btnStart.style.display = 'block';
        }
    }
    spin();
}
