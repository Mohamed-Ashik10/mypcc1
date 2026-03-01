; (function () {
    // ══ PAGE SWITCHING ══
    function showPage(id, btn) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + id).classList.add('active');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        if (btn && btn.classList && btn.classList.contains('nav-tab')) btn.classList.add('active');
    }

    // ══ DATA SOURCES (PRIORITIZE DB) ══
    const hymns = window.hymns_db || [
        {
            num: '001', title: 'Amazing Grace', author: 'John Newton · 1779', tags: ['grace', 'faith'],
            lyrics: [
                { type: 'stanza', text: 'Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.' },
                { type: 'stanza', text: 'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.' },
                { type: 'refrain', text: 'My chains are gone, I have been set free\nMy God, my Savior has ransomed me\nAnd like a flood His mercy rains\nUnending love, Amazing Grace' },
                { type: 'stanza', text: "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home." },
            ]
        },
        {
            num: '012', title: 'It Is Well With My Soul', author: 'Horatio Spafford · 1873', tags: ['comfort', 'peace', 'faith'],
            lyrics: [
                { type: 'stanza', text: 'When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.' },
                { type: 'refrain', text: 'It is well (it is well)\nWith my soul (with my soul)\nIt is well, it is well with my soul.' },
                { type: 'stanza', text: 'Though Satan should buffet, though trials should come,\nLet this blest assurance control;\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul.' },
            ]
        },
        {
            num: '034', title: 'How Great Thou Art', author: 'Carl Boberg · 1885', tags: ['praise', 'wonder'],
            lyrics: [
                { type: 'stanza', text: 'O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.' },
                { type: 'refrain', text: 'Then sings my soul, my Savior God, to Thee;\nHow great Thou art, how great Thou art!\nThen sings my soul, my Savior God, to Thee;\nHow great Thou art, how great Thou art!' },
            ]
        },
        {
            num: '047', title: 'Be Thou My Vision', author: 'Irish Hymn · 8th Century', tags: ['faith', 'devotion'],
            lyrics: [
                { type: 'stanza', text: 'Be Thou my vision, O Lord of my heart;\nNought be all else to me, save that Thou art;\nThou my best thought by day or by night,\nWaking or sleeping, Thy presence my light.' },
                { type: 'stanza', text: 'Be Thou my wisdom, and Thou my true word;\nI ever with Thee and Thou with me, Lord;\nThou my great Father, and I Thy true son,\nThou in me dwelling, and I with Thee one.' },
            ]
        },
        {
            num: '058', title: 'Holy, Holy, Holy', author: 'Reginald Heber · 1826', tags: ['praise', 'advent'],
            lyrics: [
                { type: 'stanza', text: 'Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy! Merciful and mighty!\nGod in three Persons, blessed Trinity!' },
                { type: 'stanza', text: 'Holy, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWho wert and art and evermore shalt be.' },
            ]
        },
        {
            num: '071', title: 'Blessed Assurance', author: 'Fanny Crosby · 1873', tags: ['comfort', 'grace'],
            lyrics: [
                { type: 'stanza', text: 'Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.' },
                { type: 'refrain', text: 'This is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long.' },
            ]
        },
        {
            num: '085', title: 'Great Is Thy Faithfulness', author: 'Thomas O. Chisholm · 1923', tags: ['faith', 'praise'],
            lyrics: [
                { type: 'stanza', text: 'Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been, Thou forever wilt be.' },
                { type: 'refrain', text: 'Great is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided;\nGreat is Thy faithfulness, Lord, unto me!' },
            ]
        },
        {
            num: '093', title: 'Be Still, My Soul', author: 'Katharina von Schlegel · 1752', tags: ['comfort', 'peace', 'advent'],
            lyrics: [
                { type: 'stanza', text: 'Be still, my soul: the Lord is on thy side;\nBear patiently the cross of grief or pain;\nLeave to thy God to order and provide;\nIn every change He faithful will remain.' },
            ]
        },
    ];

    let activeFilter = 'all';
    function renderHymns(list) {
        const grid = document.getElementById('hymnsGrid');
        grid.innerHTML = '';
        list.forEach((h, i) => {
            const card = document.createElement('div');
            card.className = 'hymn-card';
            card.style.animationDelay = (i * 0.05) + 's';
            card.innerHTML = `
      <div class="hymn-play">▶</div>
      <p class="hymn-num">No. ${h.num}</p>
      <h3 class="hymn-name">${h.title}</h3>
      <p class="hymn-author">${h.author}</p>
      <div class="hymn-tags">${h.tags.map(t => `<span class="htag">${t}</span>`).join('')}</div>`;
            card.onclick = () => openHymn(h);
            grid.appendChild(card);
        });
    }

    function filterHymns() {
        const q = document.getElementById('hymnSearch').value.toLowerCase();
        let list = hymns;
        if (activeFilter !== 'all') list = list.filter(h => h.tags.includes(activeFilter));
        if (q) list = list.filter(h => h.title.toLowerCase().includes(q) || h.author.toLowerCase().includes(q));
        renderHymns(list);
    }

    function setFilter(btn, f) {
        activeFilter = f;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterHymns();
    }

    // ══ TTS STATE ══
    let _ttsHymn = null;
    let _ttsSpeaking = false;
    let _ttsPaused = false;

    function openHymn(h) {
        // Stop any ongoing speech when opening a new/different hymn
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        _ttsHymn = h;
        _ttsSpeaking = false;
        _ttsPaused = false;

        document.getElementById('m-eyebrow').textContent = 'Hymn No. ' + h.num;
        document.getElementById('m-title').textContent = h.title;
        document.getElementById('m-author').textContent = h.author;
        let lyricsHTML = '';
        h.lyrics.forEach(l => {
            const cls = l.type === 'refrain' ? 'refrain' : 'stanza';
            lyricsHTML += `<div class="${cls}">${l.text.replace(/\n/g, '<br>')}</div>`;
        });
        document.getElementById('m-lyrics').innerHTML = lyricsHTML;
        buildWave('modalWave', 22);
        document.getElementById('hymnModal').classList.add('open');
        // Reset play button
        const btn = document.querySelector('.modal-play-btn');
        if (btn) btn.textContent = '▶ Play';
    }

    function closeModal() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        _ttsSpeaking = false; _ttsPaused = false;
        document.getElementById('hymnModal').classList.remove('open');
    }

    function togglePlay(btn) {
        if (!window.speechSynthesis) {
            alert('Text-to-speech is not supported in your browser.');
            return;
        }
        const synth = window.speechSynthesis;

        // ── PAUSE ──
        if (_ttsSpeaking && !_ttsPaused) {
            synth.pause();
            _ttsPaused = true;
            btn.textContent = '▶ Play';
            _setWaveState(false);
            return;
        }

        // ── RESUME ──
        if (_ttsSpeaking && _ttsPaused) {
            synth.resume();
            _ttsPaused = false;
            btn.textContent = '⏸ Pause';
            _setWaveState(true);
            return;
        }

        // ── FRESH START ──
        if (!_ttsHymn) return;
        synth.cancel();

        // Build one utterance per stanza/refrain for natural pacing
        const parts = [];
        parts.push(_ttsHymn.title + ', by ' + _ttsHymn.author);
        _ttsHymn.lyrics.forEach((l, idx) => {
            const label = l.type === 'refrain' ? 'Refrain. ' : ('Verse ' + (idx + 1) + '. ');
            parts.push(label + l.text.replace(/\n/g, ', '));
        });

        let partIdx = 0;
        function speakNext() {
            if (partIdx >= parts.length) {
                _ttsSpeaking = false; _ttsPaused = false;
                btn.textContent = '▶ Play';
                _setWaveState(false);
                return;
            }
            const utt = new SpeechSynthesisUtterance(parts[partIdx++]);
            utt.rate = 0.88;   // slightly slower, reverent pace
            utt.pitch = 1.05;
            utt.lang = 'en-GB';
            // Pick a nice voice if available
            const voices = synth.getVoices();
            const preferred = voices.find(v => /samantha|google uk|daniel|karen|victoria/i.test(v.name));
            if (preferred) utt.voice = preferred;
            utt.onend = speakNext;
            utt.onerror = () => { _ttsSpeaking = false; btn.textContent = '▶ Play'; _setWaveState(false); };
            synth.speak(utt);
        }

        _ttsSpeaking = true; _ttsPaused = false;
        btn.textContent = '⏸ Pause';
        _setWaveState(true);
        speakNext();
    }

    function _setWaveState(playing) {
        const wave = document.getElementById('modalWave');
        if (!wave) return;
        wave.querySelectorAll('.pw-bar').forEach(b => {
            b.style.animationPlayState = playing ? 'running' : 'paused';
        });
    }

    function buildWave(id, count) {
        const el = document.getElementById(id);
        el.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const b = document.createElement('div');
            b.className = 'pw-bar';
            const h = Math.random() * 22 + 6;
            b.style.cssText = `height:${h}px;animation-delay:${(i * 0.06).toFixed(2)}s`;
            el.appendChild(b);
        }
    }

    // ══ DIARY DATA ══
    const diaryEntries = window.diary_db || [
        {
            id: 1, date: 'Feb 25, 2026', title: 'Morning of Quiet Grace', hymn: 'Great Is Thy Faithfulness',
            body: 'This morning I woke before sunrise and sat with this hymn for nearly an hour. The second verse felt like a letter written directly to me — "strength for today and bright hope for tomorrow." I have been carrying so much anxiety about the future, and those words settled something deep in me.',
            tags: ['gratitude', 'faithfulness', 'morning prayer']
        },
        {
            id: 2, date: 'Feb 20, 2026', title: 'A Song in the Valley', hymn: 'It Is Well With My Soul',
            body: 'After receiving difficult news this week, I found myself returning to this hymn over and over. Spafford wrote it after losing his daughters — and yet those words. How can a man write "it is well" in that moment? I am beginning to understand.',
            tags: ['comfort', 'grief', 'trust']
        },
        {
            id: 3, date: 'Feb 14, 2026', title: 'Valentines Day Worship', hymn: 'Be Thou My Vision',
            body: 'We sang this at the special service today. The ancient simplicity of it moved me to tears - that a prayer so old can still be so entirely mine. Thou my best thought by day or by night. Yes. That.',
            tags: ['worship', 'devotion', 'church']
        },
    ];

    function renderDiary(active = 0) {
        const list = document.getElementById('diaryList');
        if (!list) return;
        if (!diaryEntries || diaryEntries.length === 0) {
            list.innerHTML = '<p style="padding:20px; color:var(--muted); font-size:0.8rem; text-align:center;">No entries yet.</p>';
            const mc = document.getElementById('diaryMainContent');
            if (mc) mc.innerHTML = '<p style="padding:40px; color:var(--muted); text-align:center;">Select or create an entry to begin.</p>';
            return;
        }
        list.innerHTML = diaryEntries.map((e, i) => `
    <div class="diary-entry-item ${i === active ? 'active' : ''}" onclick="selectEntry(${i})">
      <p class="dei-date">${e.date || ''}</p>
      <p class="dei-title">${e.title || 'Untitled'}</p>
      <p class="dei-preview">${(e.body || '').substring(0, 60)}…</p>
    </div>`).join('');
        selectEntry(active);
    }

    function selectEntry(i) {
        if (!diaryEntries || !diaryEntries[i]) return;
        const e = diaryEntries[i];
        document.querySelectorAll('.diary-entry-item').forEach((el, j) =>
            el.classList.toggle('active', j === i));
        document.getElementById('newEntryForm').classList.remove('open');
        const mc = document.getElementById('diaryMainContent');
        if (!mc) return;
        mc.style.display = 'block';
        mc.innerHTML = `
    <p class="diary-main-date">${e.date || ''}</p>
    <h2 class="diary-main-title">${e.title || 'Untitled'}</h2>
    <p class="diary-main-sub">Personal reflection</p>
    <div class="diary-main-divider"></div>
    <p class="diary-main-body">${e.body || ''}</p>
    <div class="diary-hymn-ref">
      <span class="dhr-icon">♪</span>
      <div><p class="dhr-label">Companion Hymn</p><p class="dhr-name">${e.hymn || 'None'}</p></div>
    </div>
    <div class="diary-tags-row">${(e.tags || []).map(t => `<span class="dtag">${t}</span>`).join('')}</div>
    <div class="diary-footer-row">
      <button class="dfr-btn primary">Edit Entry</button>
      <button class="dfr-btn">Share</button>
    </div>`;
    }

    function showNewEntry() {
        document.getElementById('diaryMainContent').style.display = 'none';
        document.getElementById('newEntryForm').classList.add('open');
    }
    function cancelNewEntry() {
        document.getElementById('newEntryForm').classList.remove('open');
        document.getElementById('diaryMainContent').style.display = 'block';
    }

    // ══ ECHO DATA ══
    function getEchoArticles() {
        return window.echo_db || [
            {
                cat: 'testimony', title: 'From Doubt to Devotion: My Journey Back to the Church', author: 'Sarah M.', date: 'Feb 22, 2026',
                excerpt: 'For three years I stayed away. The questions felt too big, the silence too heavy. Then one Sunday morning, a single hymn changed everything…', featured: true,
                fullText: 'I remember the day vividly. The sanctuary was filled with morning light, and as the congregation stood to sing "Amazing Grace," a profound sense of peace washed over my anxious heart. The hymn spoke of being lost and found, of fear being relieved by grace. It was as if the words were written exactly for me in that moment. Slowly, week by week, I found myself returning to those pews. The church wasn\'t just a building anymore; it was a community that was holding me as I navigated my doubts, gently guiding me back to a devotion I thought I had lost forever.'
            },
            {
                cat: 'music', title: 'Why Ancient Hymns Still Speak to a Digital Generation', author: 'Pastor James L.', date: 'Feb 19, 2026',
                excerpt: 'In an age of worship anthems and streaming playlists, the old hymns are making a quiet, powerful comeback.',
                fullText: 'There is something grounding about singing the exact same words that believers sang three hundred years ago. When we sing hymns, we step into a river of worship that spans generations. Our youth are discovering that the rich theology and poetic beauty of these ancient songs offer an anchor in an increasingly chaotic, fast-paced digital world. They provide a vocabulary for sorrow, for awe, and for an enduring hope that transcends the trends of today.'
            },
            {
                cat: 'news', title: 'Community Choir Launches Hymn Recording Project', author: 'Admin', date: 'Feb 15, 2026',
                excerpt: 'Our beloved choir is preserving 100 classic hymns in studio-quality recordings for the Canticle library.',
                fullText: 'Over the next six months, the community choir will be gathering weekly in the sanctuary to record. This initiative aims to capture the authentic, reverberating sound of our congregation singing in a cherished space. The recordings will initially be added to the Canticle hymns library, allowing members to listen, practice, and worship along with familiar voices anytime, anywhere.'
            },
            {
                cat: 'community', title: 'Prayer Wall: Stories of Answered Prayer This Month', author: 'Community Team', date: 'Feb 12, 2026',
                excerpt: 'Seventeen members shared testimonies of answered prayers — from healing to provision to restored relationships.',
                fullText: 'This month, our digital and physical prayer walls have overflowed with stories of God\'s faithfulness. We\'ve seen families reunited, difficult medical diagnoses turned around, and unexpected financial provisions. One member wrote: "I asked for peace regarding a decision, and the Lord provided not just peace, but a clear, undeniable open door." Let us continue to bear one another\'s burdens and celebrate His continuous grace.'
            },
            {
                cat: 'testimony', title: 'The Hymn That Held Me Through Grief', author: 'Michael T.', date: 'Feb 8, 2026',
                excerpt: 'When I buried my mother last autumn, I did not know how to pray. But I could sing. And that was enough.',
                fullText: 'Grief has a way of silencing you. The traditional prayers felt hollow, and my own words wouldn\'t come out. Yet, as I sat alone one evening, the melody of "It Is Well With My Soul" drifted into my mind. I began to hum it, and then to sing the verses softly. The sheer faith required to declare "it is well" amidst devastation gave me a lifeline to hold onto. That hymn didn\'t erase the pain, but it tethered me to a God who understands sorrow, carrying me when I couldn\'t walk myself.'
            },
            {
                cat: 'music', title: '5 Hymns for the Season of Lent', author: 'Worship Team', date: 'Feb 1, 2026',
                excerpt: 'A curated selection of hymns for reflection, repentance and preparation during this sacred season.',
                fullText: 'As we enter the Lenten season, our focus shifts toward reflection and the profound sacrifice of the cross. We have curated a list of five hymns—"When I Survey the Wondrous Cross", "Alas! and Did My Savior Bleed", "O Sacred Head, Now Wounded", "Jesus, Keep Me Near the Cross", and "Rock of Ages". We encourage you to spend time with one hymn each week, meditating on the lyrics and allowing the truths of redemption to shape your journey toward Easter morning.'
            }
        ];
    }

    function renderEcho(filter = 'all') {
        const grid = document.getElementById('echoGrid');
        if (!grid) return;
        const eList = getEchoArticles();
        const list = filter === 'all' ? eList : eList.filter(a => a.cat === filter);
        grid.innerHTML = list.map((a, i) => `
    <div class="echo-card ${i === 0 && filter === 'all' ? 'featured' : ''}">
      ${i === 0 && filter === 'all' ? `<div class="echo-img-placeholder">✝</div>` : ''}
      <div>
        <p class="echo-card-cat">${a.cat}</p>
        <h3 class="echo-card-title">${a.title}</h3>
        <p class="echo-card-excerpt">${a.excerpt}</p>
        <div class="echo-full-content" style="display:none; margin-top:12px; font-family:'Cormorant Garamond',serif; font-size:1.05rem; line-height:1.7; color:var(--ink2);">
          ${a.fullText}
        </div>
        <div class="echo-card-meta">
          <div class="echo-avatar">${a.author?.[0] || 'A'}</div>
          <span class="echo-author">${a.author}</span>
          <span class="echo-date">· ${a.date}</span>
        </div>
        <span class="echo-read" style="cursor:pointer;" onclick="window.toggleEcho(this)">Read more →</span>
      </div>
    </div>`).join('');
    }

    function toggleEcho(btn) {
        const container = btn.parentElement;
        const fullContent = container.querySelector('.echo-full-content');

        if (fullContent.style.display === 'none') {
            fullContent.style.display = 'block';
            btn.innerHTML = 'Read less &uarr;';
        } else {
            fullContent.style.display = 'none';
            btn.innerHTML = 'Read more &rarr;';
        }
    }

    function setEchoCat(btn, cat) {
        document.querySelectorAll('.echo-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderEcho(cat);
    }

    // ══ DEVOTIONAL ARCHIVE ══
    const devoArchive = [
        { date: 'Feb 24', title: 'A Light Unto My Path', ref: 'Psalm 119:105' },
        { date: 'Feb 23', title: 'Fear Not, For I Am With You', ref: 'Isaiah 41:10' },
        { date: 'Feb 22', title: 'The Peace That Passes Understanding', ref: 'Philippians 4:7' },
        { date: 'Feb 21', title: 'Come to Me, All Who Are Weary', ref: 'Matthew 11:28' },
        { date: 'Feb 20', title: 'New Every Morning', ref: 'Lamentations 3:22–23' },
        { date: 'Feb 19', title: 'Delight Yourself in the Lord', ref: 'Psalm 37:4' },
    ];

    function renderDevotional() {
        const grid = document.getElementById('devoArchive');
        if (grid) {
            grid.innerHTML = devoArchive.map(d => `
          <div class="devo-arc-card">
            <p class="dac-date">${d.date}</p>
            <p class="dac-title">${d.title}</p>
            <p class="dac-ref">${d.ref}</p>
          </div>`).join('');
        }

        const currentContainer = document.getElementById('currentDevoContent');
        if (!currentContainer) return;

        const d = window.devotional_db || {
            title: 'Still Waters',
            date: 'February 25, 2026',
            content: '> [!NOTE]\n> "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."\n> PSALM 23:2–3\n\n### Reflection\nThere are moments when the world demands more than we have to give. The noise becomes deafening — obligations pile up, anxieties whisper, and the pace of life never seems to slow. It is into precisely this moment that the Shepherd speaks: lie down.\n\nThe invitation to still waters is not passive surrender — it is an act of trust. To rest in God\'s provision is to declare, with your body and your breath, that He is enough. That today\'s worries are held. That you are known and guided.\n\n### Prayer\nLord, still the rushing waters of my mind today. Let me hear Your voice above the noise. Lead me to the quiet places where my soul is restored, and remind me that in Your presence, I lack nothing. Amen.\n\n### Companion Hymn\nBe Still, My Soul',
            author: 'Worship Team'
        };

        function parseFullDevotion(d) {
            if (!d) return '';
            let html = '';

            // 1. Title Area
            html += `
                <div class="devo-hero" style="display:block;">
                    <p class="devo-day-label">Today's Devotional &middot; ${d.date}</p>
                    <h1 class="devo-today-title">${d.title}</h1>
                </div>
            `;

            let content = d.content || '';
            const lines = content.split('\n');
            let quoteLines = [];
            let refLine = '';
            let isQuote = false;
            let sections = { reflection: '', prayer: '', hymn: '' };
            let currentSection = 'reflection';

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                const trimmed = line.trim();

                if (trimmed === '> [!NOTE]') { isQuote = true; continue; }
                if (trimmed.startsWith('>')) {
                    isQuote = true;
                    let text = trimmed.substring(1).trim();
                    // Let's guess if it's the reference based on uppercase or starting with a number/book name
                    if (trimmed.length > 2 && (text === text.toUpperCase() || /^[0-9]?\s?[A-Za-z]+ \d+:\d+/.test(text) || trimmed.toUpperCase().includes('PSALM'))) {
                        refLine = text;
                    } else if (text !== '') {
                        quoteLines.push(text.replace(/^["'](.*)["']$/, '$1')); // remove wrapping quotes if present
                    }
                    continue;
                } else {
                    isQuote = false;
                }

                if (trimmed.startsWith('### Reflection')) { currentSection = 'reflection'; continue; }
                if (trimmed.startsWith('### Prayer')) { currentSection = 'prayer'; continue; }
                if (trimmed.toLowerCase().includes('### companion hymn')) { currentSection = 'hymn'; continue; }

                if (trimmed !== '') {
                    sections[currentSection] += trimmed + '\n\n';
                }
            }

            // Build Quote Box
            if (quoteLines.length > 0) {
                html += `
                    <div class="devo-verse-box">
                        <p class="devo-verse-text">"${quoteLines.join('<br>')}"</p>
                        ${refLine ? `<p class="devo-verse-ref">&mdash; ${refLine}</p>` : ''}
                    </div>
                `;
            }

            // Reflection
            if (sections.reflection.trim()) {
                html += `
                    <div class="devo-reflection">
                        <h3 class="devo-reflection-title">Reflection</h3>
                        <div class="devo-reflection-body">
                            <p>${sections.reflection.trim().replace(/\n\n/g, '</p><p>')}</p>
                        </div>
                    </div>
                `;
            }

            // Prayer
            if (sections.prayer.trim()) {
                html += `
                    <div class="devo-prayer">
                        <p class="devo-prayer-label">Prayer</p>
                        <p class="devo-prayer-text">${sections.prayer.trim().replace(/\n\n/g, '<br><br>')}</p>
                    </div>
                `;
            }

            // Companion Hymn
            let hymnName = sections.hymn.trim();
            if (hymnName) {
                html += `
                    <div class="devo-hymn-link" onclick="window.showPage('hymns', document.querySelectorAll('.nav-tab')[1])">
                        <span class="dhl-icon">&#9834;</span>
                        <div>
                            <p class="dhl-label">Today's Companion Hymn</p>
                            <p class="dhl-name">${hymnName}</p>
                        </div>
                        <span class="dhl-arrow">&rarr;</span>
                    </div>
                `;
            }

            return html;
        }

        currentContainer.innerHTML = parseFullDevotion(d);

        // Remove the static "Daily Devotional" header, we're rendering it dynamically!
        const hero = document.querySelector('.devo-hero');
        if (hero) hero.style.display = 'none';
    }

    // ══ SUBSCRIPTIONS ══
    const plans = [
        {
            name: 'Seeker', price: { monthly: 0, annual: 0 }, popular: false,
            features: ['Access to 100 free hymns', 'Church Diary (5 entries)', 'Daily Devotional', 'The Echo newsletter'],
            absent: ['Full hymn library (850+)', 'Unlimited diary entries', 'Audio playback', 'Offline access']
        },
        {
            name: 'Pilgrim', price: { monthly: 7, annual: 5 }, popular: true,
            features: ['Full hymn library (850+)', 'Unlimited diary entries', 'Audio playback', 'Daily devotionals', 'The Echo — full access', 'Scripture cross-references'],
            absent: ['Offline access']
        },
        {
            name: 'Shepherd', price: { monthly: 18, annual: 12 }, popular: false,
            features: ['Everything in Pilgrim', 'Offline access', 'Community groups', 'Share diary entries', 'Priority support', 'Exclusive choir recordings']
        },
    ];

    let billing = 'monthly';
    function renderPlans() {
        const sp = document.getElementById('subPlans');
        if (!sp) return;
        sp.innerHTML = plans.map(p => `
    <div class="sub-plan ${p.popular ? 'popular' : ''}">
      ${p.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
      <p class="sub-plan-name">${p.name}</p>
      <p class="sub-plan-price">${p.price[billing] === 0 ? 'Free' : '<span>$</span>' + p.price[billing]}</p>
      <p class="sub-plan-period">${p.price[billing] === 0 ? 'Always free' : billing === 'monthly' ? 'per month' : 'per month, billed annually'}</p>
      <div class="sub-divider"></div>
      <ul class="sub-features-list">
        ${p.features.map(f => `<li>${f}</li>`).join('')}
        ${p.absent ? p.absent.map(f => `<li class="off">${f}</li>`).join('') : ''}
      </ul>
      <button class="sub-cta-btn" onclick="handleSubscribe('${p.name.toUpperCase()}', '${billing.toUpperCase()}')">
        ${p.price[billing] === 0 ? 'Get Started Free' : 'Subscribe Now'}
      </button>
    </div>`).join('');
    }

    function setBilling(btn, b) {
        billing = b;
        document.querySelectorAll('.sub-toggle-btn').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        renderPlans();
    }

    // ══ SUBSCRIPTION HANDLER ══
    async function handleSubscribe(planType, billingCycle) {
        // If user is not logged in, redirect to sign in
        let sessionRes;
        try { sessionRes = await fetch('/api/auth/session'); } catch (e) { }
        const sessionData = sessionRes ? await sessionRes.json() : null;
        if (!sessionData || !sessionData.user) {
            showCanticleToast('Please sign in to subscribe ✦', 'info');
            setTimeout(() => { window.location.href = '/auth/login'; }, 1200);
            return;
        }

        // Show confirmation modal
        showSubConfirmModal(planType, billingCycle);
    }

    function showSubConfirmModal(planType, billingCycle) {
        // Remove any existing modal
        const existing = document.getElementById('subConfirmModal');
        if (existing) existing.remove();

        const planLabel = planType.charAt(0) + planType.slice(1).toLowerCase();
        const cycleLabel = billingCycle === 'ANNUAL' ? 'Annual' : 'Monthly';

        const modal = document.createElement('div');
        modal.id = 'subConfirmModal';
        modal.style.cssText = `position:fixed;inset:0;background:rgba(26,21,16,.75);backdrop-filter:blur(8px);z-index:3000;display:flex;align-items:center;justify-content:center;animation:pageIn .3s ease both;`;
        modal.innerHTML = `
          <div style="background:#fdfaf5;max-width:480px;width:90%;padding:48px 40px;border:1px solid rgba(184,147,90,.25);position:relative;">
            <button onclick="document.getElementById('subConfirmModal').remove()" style="position:absolute;top:166px;right:20px;background:none;border:none;font-size:1.3rem;color:#7a7060;cursor:pointer;">✕</button>
            <p style="font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:#b8935a;margin-bottom:12px;">Subscription</p>
            <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:400;margin-bottom:8px;">${planLabel} Plan</h3>
            <p style="font-size:.82rem;color:#7a7060;margin-bottom:28px;">${cycleLabel} billing · Choose your payment method</p>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
              <button onclick="confirmSubscribe('${planType}','${billingCycle}','MOBILE_MONEY',this)" style="padding:14px 20px;border:1px solid rgba(184,147,90,.3);background:#fff;text-align:left;cursor:pointer;font-family:'Jost',sans-serif;font-size:.82rem;font-weight:300;transition:all .25s;" onmouseover="this.style.borderColor='#b8935a'" onmouseout="this.style.borderColor='rgba(184,147,90,.3)'">📱 Pay with Mobile Money (MTN / Orange)</button>
              <button onclick="confirmSubscribe('${planType}','${billingCycle}','VISA',this)" style="padding:14px 20px;border:1px solid rgba(184,147,90,.3);background:#fff;text-align:left;cursor:pointer;font-family:'Jost',sans-serif;font-size:.82rem;font-weight:300;transition:all .25s;" onmouseover="this.style.borderColor='#b8935a'" onmouseout="this.style.borderColor='rgba(184,147,90,.3)'">💳 Pay with Visa / Mastercard</button>
              <button onclick="confirmSubscribe('${planType}','${billingCycle}','PAYPAL',this)" style="padding:14px 20px;border:1px solid rgba(184,147,90,.3);background:#fff;text-align:left;cursor:pointer;font-family:'Jost',sans-serif;font-size:.82rem;font-weight:300;transition:all .25s;" onmouseover="this.style.borderColor='#b8935a'" onmouseout="this.style.borderColor='rgba(184,147,90,.3)'">🅿️ Pay with PayPal</button>
            </div>
            <p style="font-size:.7rem;color:#a09585;text-align:center;">Secure payment · Cancel anytime</p>
          </div>`;
        document.body.appendChild(modal);
        // Close on backdrop click
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    }

    async function confirmSubscribe(planType, billingCycle, paymentMethod, btn) {
        btn.textContent = '⏳ Processing…';
        btn.disabled = true;
        try {
            const res = await fetch('/api/subscriptions/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType, billingCycle, paymentMethod })
            });
            const data = await res.json();
            document.getElementById('subConfirmModal').remove();
            if (res.ok && data.success) {
                showCanticleToast(`✦ You\'re now on the ${planType.charAt(0) + planType.slice(1).toLowerCase()} plan!`, 'success');
            } else {
                showCanticleToast('Subscription failed. Please try again.', 'error');
            }
        } catch (e) {
            showCanticleToast('Network error. Please check your connection.', 'error');
        }
    }

    function showCanticleToast(message, type = 'success') {
        const existing = document.getElementById('canticleToast');
        if (existing) existing.remove();
        const colors = { success: '#b8935a', error: '#c0392b', info: '#2e2820' };
        const toast = document.createElement('div');
        toast.id = 'canticleToast';
        toast.style.cssText = `position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:${colors[type]};color:#fdfaf5;padding:14px 28px;font-family:'Jost',sans-serif;font-size:.78rem;letter-spacing:.08em;font-weight:300;z-index:4000;border-radius:2px;box-shadow:0 8px 24px rgba(0,0,0,.2);animation:fadeUp .4s ease both;`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // ══ INIT ══
    renderHymns(hymns);
    renderDiary();
    renderEcho();
    renderPlans();
    renderDevotional();

    // ══ STICKY SCROLL — panel + card switching ══
    function initStickyScroll() {
        const section = document.querySelector('.sticky-section');
        if (!section) return;
        const panels = document.querySelectorAll('.sticky-panel');
        const cards = document.querySelectorAll('.sticky-card');
        const total = panels.length;

        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            const sectionH = section.offsetHeight;
            const progress = Math.max(0, Math.min(1, -rect.top / (sectionH - window.innerHeight)));
            const idx = Math.min(total - 1, Math.floor(progress * total));

            panels.forEach((p, i) => p.classList.toggle('active', i === idx));
            cards.forEach((c, i) => c.classList.toggle('active', i === idx));
        });
    }
    initStickyScroll();

    // ══ SCROLL ANIMATION ENGINE ══

    // 1. Scroll progress bar
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        document.getElementById('scrollBar').style.width = pct + '%';

        // 2. Parallax cross — subtle drift on scroll
        const cross = document.getElementById('parallaxCross');
        cross.style.transform = `translate(-50%, calc(-50% + ${scrollTop * 0.12}px)) rotate(${scrollTop * 0.01}deg)`;

        // 3. Nav shrink on scroll
        const nav = document.querySelector('nav');
        if (scrollTop > 60) {
            nav.style.height = '52px';
            nav.style.background = 'rgba(253,250,245,0.98)';
        } else {
            nav.style.height = '64px';
            nav.style.background = 'rgba(253,250,245,0.92)';
        }
    });

    // 4. Intersection Observer — reveal elements as they enter view
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function observeReveals() {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            revealObserver.observe(el);
        });
    }
    observeReveals();

    // Re-run observer when switching pages so new page elements animate in
    const _origShowPage = showPage;
    window.showPage = function (id, btn) {
        _origShowPage(id, btn);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(observeReveals, 50);
    };
    // ══ DAILY PSALM — changes automatically every calendar day ══
    const dailyPsalms = [
        { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
        { text: "He makes me lie down in green pastures; he leads me beside still waters.", ref: "Psalm 23:2" },
        { text: "Even though I walk through the valley of the shadow of death, I will fear no evil.", ref: "Psalm 23:4" },
        { text: "The Lord is my light and my salvation — whom shall I fear?", ref: "Psalm 27:1" },
        { text: "Wait for the Lord; be strong, and let your heart take courage.", ref: "Psalm 27:14" },
        { text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him.", ref: "Psalm 34:8" },
        { text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", ref: "Psalm 34:18" },
        { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4" },
        { text: "Commit your way to the Lord; trust in him and he will act.", ref: "Psalm 37:5" },
        { text: "God is our refuge and strength, an ever-present help in trouble.", ref: "Psalm 46:1" },
        { text: "Be still, and know that I am God.", ref: "Psalm 46:10" },
        { text: "Create in me a clean heart, O God, and renew a right spirit within me.", ref: "Psalm 51:10" },
        { text: "Cast your burden on the Lord, and he will sustain you.", ref: "Psalm 55:22" },
        { text: "In God I trust; I shall not be afraid. What can man do to me?", ref: "Psalm 56:11" },
        { text: "My soul finds rest in God alone; my salvation comes from him.", ref: "Psalm 62:1" },
        { text: "You are my God, earnestly I seek you; my soul thirsts for you.", ref: "Psalm 63:1" },
        { text: "Praise the Lord, all his works everywhere in his dominion.", ref: "Psalm 103:22" },
        { text: "The Lord is compassionate and gracious, slow to anger, abounding in love.", ref: "Psalm 103:8" },
        { text: "As far as the east is from the west, so far has he removed our transgressions from us.", ref: "Psalm 103:12" },
        { text: "Bless the Lord, O my soul, and all that is within me, bless his holy name.", ref: "Psalm 103:1" },
        { text: "Give thanks to the Lord, for he is good; his love endures forever.", ref: "Psalm 107:1" },
        { text: "Your word is a lamp to my feet and a light to my path.", ref: "Psalm 119:105" },
        { text: "I lift up my eyes to the hills. From where does my help come?", ref: "Psalm 121:1" },
        { text: "My help comes from the Lord, who made heaven and earth.", ref: "Psalm 121:2" },
        { text: "The Lord will keep your going out and your coming in from this time forth.", ref: "Psalm 121:8" },
        { text: "I rejoiced when they said to me, let us go to the house of the Lord.", ref: "Psalm 122:1" },
        { text: "Unless the Lord builds the house, those who build it labor in vain.", ref: "Psalm 127:1" },
        { text: "Children are a heritage from the Lord, offspring a reward from him.", ref: "Psalm 127:3" },
        { text: "I praise you because I am fearfully and wonderfully made.", ref: "Psalm 139:14" },
        { text: "Search me, O God, and know my heart; test me and know my anxious thoughts.", ref: "Psalm 139:23" },
        { text: "Sing to the Lord a new song; sing to the Lord, all the earth.", ref: "Psalm 96:1" },
        { text: "The heavens declare the glory of God; the skies proclaim the work of his hands.", ref: "Psalm 19:1" },
        { text: "The law of the Lord is perfect, refreshing the soul.", ref: "Psalm 19:7" },
        { text: "May these words of my mouth and this meditation of my heart be pleasing in your sight.", ref: "Psalm 19:14" },
        { text: "The Lord is my strength and my shield; my heart trusts in him.", ref: "Psalm 28:7" },
        { text: "Weeping may stay for the night, but rejoicing comes in the morning.", ref: "Psalm 30:5" },
        { text: "In you, Lord my God, I put my trust.", ref: "Psalm 25:1" },
        { text: "Show me your ways, Lord, teach me your paths.", ref: "Psalm 25:4" },
        { text: "The earth is the Lord's and everything in it, the world and all who live in it.", ref: "Psalm 24:1" },
        { text: "He restores my soul. He leads me in right paths for his name's sake.", ref: "Psalm 23:3" },
        { text: "Let everything that has breath praise the Lord.", ref: "Psalm 150:6" },
        { text: "The Lord reigns, let the earth be glad.", ref: "Psalm 97:1" },
        { text: "Enter his gates with thanksgiving and his courts with praise.", ref: "Psalm 100:4" },
        { text: "Know that the Lord is God. It is he who made us, and we are his.", ref: "Psalm 100:3" },
        { text: "His love endures forever and his faithfulness through all generations.", ref: "Psalm 100:5" },
        { text: "I will extol the Lord at all times; his praise will always be on my lips.", ref: "Psalm 34:1" },
        { text: "The Lord is near to all who call on him, to all who call on him in truth.", ref: "Psalm 145:18" },
        { text: "Great is the Lord and most worthy of praise; his greatness no one can fathom.", ref: "Psalm 145:3" },
        { text: "The Lord upholds all who fall and lifts up all who are bowed down.", ref: "Psalm 145:14" },
        { text: "Not to us, Lord, not to us but to your name be the glory.", ref: "Psalm 115:1" },
        { text: "I will lift up the cup of salvation and call on the name of the Lord.", ref: "Psalm 116:13" },
        { text: "Precious in the sight of the Lord is the death of his faithful servants.", ref: "Psalm 116:15" },
        { text: "This is the day the Lord has made; let us rejoice and be glad in it.", ref: "Psalm 118:24" },
        { text: "Give thanks to the Lord, for he is good; his love endures forever.", ref: "Psalm 118:1" },
        { text: "How can a young person stay on the path of purity? By living according to your word.", ref: "Psalm 119:9" },
        { text: "I have hidden your word in my heart that I might not sin against you.", ref: "Psalm 119:11" },
        { text: "Direct my footsteps according to your word; let no sin rule over me.", ref: "Psalm 119:133" },
        { text: "The unfolding of your words gives light; it gives understanding to the simple.", ref: "Psalm 119:130" },
        { text: "I wait for the Lord, my whole being waits, and in his word I put my hope.", ref: "Psalm 130:5" },
        { text: "With the Lord there is unfailing love and with him is full redemption.", ref: "Psalm 130:7" },
        { text: "My heart is not lifted up; my eyes are not raised too high.", ref: "Psalm 131:1" },
        { text: "How good and pleasant it is when God's people live together in unity.", ref: "Psalm 133:1" },
        { text: "I will give you thanks, for you answered me; you have become my salvation.", ref: "Psalm 118:21" },
        { text: "The Lord is gracious and righteous; our God is full of compassion.", ref: "Psalm 116:5" },
        { text: "Sing praises to God, sing praises; sing praises to our King, sing praises.", ref: "Psalm 47:6" },
        { text: "Clap your hands, all you nations; shout to God with cries of joy.", ref: "Psalm 47:1" },
        { text: "How lovely is your dwelling place, Lord Almighty!", ref: "Psalm 84:1" },
        { text: "Blessed are those who dwell in your house; they are ever praising you.", ref: "Psalm 84:4" },
        { text: "Better is one day in your courts than a thousand elsewhere.", ref: "Psalm 84:10" },
        { text: "For the Lord God is a sun and shield; the Lord bestows favor and honor.", ref: "Psalm 84:11" },
        { text: "Righteousness and peace kiss each other. Faithfulness springs forth from the earth.", ref: "Psalm 85:10" },
        { text: "Teach me your way, Lord, that I may rely on your faithfulness.", ref: "Psalm 86:11" },
        { text: "You are forgiving and good, O Lord, abounding in love to all who call to you.", ref: "Psalm 86:5" },
        { text: "He who dwells in the shelter of the Most High will rest in the shadow of the Almighty.", ref: "Psalm 91:1" },
        { text: "He will cover you with his feathers, and under his wings you will find refuge.", ref: "Psalm 91:4" },
        { text: "For he will command his angels concerning you to guard you in all your ways.", ref: "Psalm 91:11" },
        { text: "It is good to praise the Lord and make music to your name, O Most High.", ref: "Psalm 92:1" },
        { text: "The Lord reigns, he is robed in majesty; the Lord is robed in majesty and armed with strength.", ref: "Psalm 93:1" },
        { text: "Come, let us sing for joy to the Lord; let us shout aloud to the Rock of our salvation.", ref: "Psalm 95:1" },
        { text: "For the Lord is the great God, the great King above all gods.", ref: "Psalm 95:3" },
        { text: "Worship the Lord in the splendor of his holiness; tremble before him, all the earth.", ref: "Psalm 96:9" },
        { text: "The Lord is king; let the nations tremble! He sits enthroned between the cherubim.", ref: "Psalm 99:1" },
        { text: "Shout for joy to the Lord, all the earth. Worship the Lord with gladness.", ref: "Psalm 100:1-2" },
        { text: "My eyes will be on the faithful in the land, that they may dwell with me.", ref: "Psalm 101:6" },
        { text: "Let this be written for a future generation, that a people not yet created may praise the Lord.", ref: "Psalm 102:18" },
        { text: "From everlasting to everlasting the Lord's love is with those who fear him.", ref: "Psalm 103:17" },
        { text: "He remembers that we are dust.", ref: "Psalm 103:14" },
        { text: "O Lord, how many are your works! In wisdom you made them all.", ref: "Psalm 104:24" },
        { text: "Give praise to the Lord, proclaim his name; make known among the nations what he has done.", ref: "Psalm 105:1" },
        { text: "He remembers his covenant forever, the promise he made for a thousand generations.", ref: "Psalm 105:8" },
        { text: "Praise the Lord. Give thanks to the Lord, for he is good.", ref: "Psalm 106:1" },
        { text: "Let them give thanks to the Lord for his unfailing love and his wonderful deeds.", ref: "Psalm 107:8" },
        { text: "He lifted the needy out of their affliction and increased their families like flocks.", ref: "Psalm 107:41" },
        { text: "My heart, O God, is steadfast; I will sing and make music with all my soul.", ref: "Psalm 108:1" },
        { text: "The Lord says to my lord: Sit at my right hand until I make your enemies a footstool.", ref: "Psalm 110:1" },
        { text: "Praise the Lord. I will extol the Lord with all my heart.", ref: "Psalm 111:1" },
        { text: "The fear of the Lord is the beginning of wisdom.", ref: "Psalm 111:10" },
        { text: "Blessed are those who fear the Lord, who find great delight in his commands.", ref: "Psalm 112:1" },
        { text: "Light shines in the darkness for the upright, for the gracious and compassionate.", ref: "Psalm 112:4" },
        { text: "Praise the Lord. Praise him, servants of the Lord, praise the name of the Lord.", ref: "Psalm 113:1" },
        { text: "Who is like the Lord our God, the One who sits enthroned on high?", ref: "Psalm 113:5" },
        { text: "He raises the poor from the dust and lifts the needy from the ash heap.", ref: "Psalm 113:7" },
        { text: "Tremble, earth, at the presence of the Lord.", ref: "Psalm 114:7" },
        { text: "O house of Israel, trust in the Lord — he is their help and shield.", ref: "Psalm 115:9" },
        { text: "I love the Lord, for he heard my voice; he heard my cry for mercy.", ref: "Psalm 116:1" },
        { text: "Praise the Lord, all you nations; extol him, all you peoples.", ref: "Psalm 117:1" },
        { text: "Great is his love toward us, and the faithfulness of the Lord endures forever.", ref: "Psalm 117:2" },
    ];

    // Get day of year (0-364) to pick today's psalm
    function getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24)) - 1;
    }

    const todayIdx = getDayOfYear() % dailyPsalms.length;
    const todayPsalm = dailyPsalms[todayIdx];

    // Set today's psalm immediately
    const vt = document.getElementById('verseText');
    const vr = document.getElementById('verseRef');
    if (vt && vr) {
        vt.textContent = '\u201c' + todayPsalm.text + '\u201d';
        vr.textContent = todayPsalm.ref;
    }

    // Show today's date label next to the psalm ref
    const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (vr) vr.textContent = todayPsalm.ref + '  \u00b7  ' + dateLabel;

    // Mobile nav visibility
    if (window.innerWidth < 768) {
        document.getElementById('mobileNav').style.display = 'block';
    }

    // Close modal on bg click
    document.getElementById('hymnModal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });

    // Expose showPage globally so inline onclick="showPage(...)" handlers still work
    window.showPage = window.showPage || showPage;
    window.setBilling = setBilling;
    window.setFilter = setFilter;
    window.setEchoCat = setEchoCat;
    window.closeModal = closeModal;
    window.togglePlay = togglePlay;
    window.filterHymns = filterHymns;
    window.showNewEntry = showNewEntry;
    window.cancelNewEntry = cancelNewEntry;
    window.toggleEcho = toggleEcho;
    window.selectEntry = selectEntry;
    // Subscription handlers
    window.handleSubscribe = handleSubscribe;
    window.confirmSubscribe = confirmSubscribe;
})();