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
            num: '001', title: 'Amazing Grace', author: 'John Newton · 1779', tags: ['grace', 'faith', 'Psalm 103'],
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
            num: '034', title: 'How Great Thou Art', author: 'Carl Boberg · 1885', tags: ['praise', 'wonder', 'Psalm 104:1'],
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
            num: '071', title: 'Blessed Assurance', author: 'Fanny Crosby · 1873', tags: ['comfort', 'grace', 'Hebrews 10:22'],
            lyrics: [
                { type: 'stanza', text: 'Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.' },
                { type: 'refrain', text: 'This is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long.' },
            ]
        },
        {
            num: '085', title: 'Great Is Thy Faithfulness', author: 'Thomas O. Chisholm · 1923', tags: ['faith', 'praise', 'Lamentations 3:23'],
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

    window.toggleFavorite = async function (hymnId, el, isModalBtn = false) {
        if (!hymnId) return;

        // NEW: Proactive Login Check
        if (!window.userSession || !window.userSession.user) {
            showToast("Please sign in to save your favorite hymns to your cloud library.");
            // Optional: Redirect them to the login page after a short delay
            setTimeout(() => {
                if (confirm("Would you like to sign in now to save your favorites?")) {
                    window.location.href = '/auth/login';
                }
            }, 500);
            return;
        }

        window.hymnFavorites = window.hymnFavorites || [];
        const isFav = window.hymnFavorites.includes(hymnId);

        // Optimistic UI update
        if (isFav) {
            window.hymnFavorites = window.hymnFavorites.filter(id => id !== hymnId);
            if (isModalBtn) {
                el.innerHTML = '♡ Add to Favorites';
                el.style.color = '';
            } else {
                el.style.color = 'rgba(247,243,236,.2)';
            }
        } else {
            window.hymnFavorites.push(hymnId);
            if (isModalBtn) {
                el.innerHTML = '♥ Saved to Favorites';
                el.style.color = '#d9534f';
            } else {
                el.style.color = '#d9534f';
            }
        }

        // Keep grid icons in sync if triggered from modal
        if (isModalBtn) {
            renderHymns(hymns); // Re-render grid to update the small hearts
        }

        try {
            const res = await fetch('/api/hymn-favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hymnId })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(data.error || 'Failed to save favorite. Are you logged in?');

                // Revert optimistic UI
                if (isFav) {
                    window.hymnFavorites.push(hymnId);
                } else {
                    window.hymnFavorites = window.hymnFavorites.filter(id => id !== hymnId);
                }

                if (isModalBtn) {
                    const mBtn = document.getElementById('modal-fav-btn');
                    if (mBtn) {
                        mBtn.innerHTML = isFav ? '♥ Saved to Favorites' : '♡ Add to Favorites';
                        mBtn.style.color = isFav ? '#d9534f' : '';
                    }
                }
                renderHymns(hymns);
                return;
            }

            // If we have a refresh function for the favorites modal, call it here
            if (typeof window.refreshFavoritesModal === 'function') {
                window.refreshFavoritesModal();
            }
        } catch (err) {
            console.error('Failed to toggle favorite', err);
            alert('A network error occurred while saving your favorite.');
        }
    };

    window._activePlaylistName = null;
    function renderHymns(list) {
        window._currentHymnList = list || [];
        const grid = document.getElementById('hymnsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        // Show a "Viewing Playlist: name" info if active
        if (window._activePlaylistName) {
            const info = document.createElement('div');
            info.style.gridColumn = '1 / -1';
            info.style.marginBottom = '20px';
            info.style.display = 'flex';
            info.style.justifyContent = 'space-between';
            info.style.alignItems = 'center';
            info.style.background = 'rgba(184,147,90,0.05)';
            info.style.padding = '12px 20px';
            info.style.borderRadius = '12px';
            info.innerHTML = `
                <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--gold);">Viewing Playlist: <strong>${window._activePlaylistName}</strong></span>
                <button style="background: none; border: 1px solid var(--gold); color: var(--gold); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; cursor: pointer; text-transform: uppercase;" onclick="window._activePlaylistName=null; renderHymns(window.hymns_db)">Back to All Hymns</button>
            `;
            grid.appendChild(info);
        }

        const favs = window.hymnFavorites || [];
        list.forEach((h, i) => {
            const isFav = favs.includes(h.id);
            const card = document.createElement('div');
            card.className = 'hymn-card';
            card.style.animationDelay = (i * 0.05) + 's';
            card.style.position = 'relative'; // Ensure absolute positioning works

            // Add Remove button if in playlist view
            let removeBtn = '';
            if (window._activePlaylistName) {
                removeBtn = `<div class="hymn-rem" style="position:absolute; top:45px; right:12px; font-size:1.1rem; cursor:pointer; color:#d9534f; z-index:2; opacity: 0.6; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6" onclick="event.stopPropagation(); window.removeFromPlaylist('${window._activePlaylistName}', '${h.id}')" title="Remove from Playlist">🗑️</div>`;
            }

            card.innerHTML = `
      <div class="hymn-fav" style="position:absolute; top:12px; right:12px; font-size:1.4rem; cursor:pointer; color:${isFav ? '#d9534f' : 'rgba(247,243,236,.2)'}; z-index:2; transition: color 0.3s;" onclick="event.stopPropagation(); window.toggleFavorite('${h.id}', this)" title="Add to Favorites">♥</div>
      ${removeBtn}
      <div class="hymn-play">▶</div>
      <p class="hymn-num">No. ${h.num}</p>
      <h3 class="hymn-name">${h.title}</h3>
      <p class="hymn-author">${h.author || ''}</p>
      <div class="hymn-tags">${(Array.isArray(h.tags) ? h.tags : (typeof h.tags === 'string' ? h.tags.split(/[,;]\s*/) : [])).map(t => `<span class="htag">${t}</span>`).join('')}</div>`;
            card.onclick = () => openHymn(h);
            grid.appendChild(card);
        });

        // Paywall Upgrade Tile
        if (window.isPaywallActive && list.length > 0) {
            const upgradeCard = document.createElement('div');
            upgradeCard.className = 'hymn-card';
            upgradeCard.style.cssText = `
                animation-delay: ${(list.length * 0.05).toFixed(2)}s;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                background: linear-gradient(135deg, var(--gold), #b38b4d);
                color: var(--warm);
                cursor: pointer;
                border: 1px solid var(--gold);
                box-shadow: 0 4px 12px rgba(189, 149, 81, 0.2);
            `;
            upgradeCard.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.9;">✨</div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-style: italic; font-weight: 500; margin: 0 0 8px 0;">Unlock 1,750+ Hymns</h3>
                <p style="font-size: 0.85rem; font-weight: 300; line-height: 1.4; opacity: 0.9; padding: 0 16px;">Upgrade to Pilgrims or Shepherds to access the entire sacred library.</p>
                <button style="margin-top: 20px; background: var(--warm); color: var(--gold); border: none; padding: 8px 20px; font-weight: 500; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;">Upgrade Plan</button>
            `;
            upgradeCard.onclick = () => {
                if (typeof window.showPage === 'function') {
                    const tabs = document.querySelectorAll('.nav-tab');
                    window.showPage('subs', tabs[tabs.length - 1]);
                } else {
                    window.location.href = '#page-subs';
                }
            };
            grid.appendChild(upgradeCard);
        }
    }

    const tempoList = ['fast', 'medium', 'slow'];
    const occasionList = ['morning', 'evening', 'easter', 'christmas', 'burial', 'wedding', 'praise'];

    const tempoTags = {
        fast: ['joyful', 'triumph', 'celebration', 'allegro', 'fast', 'victory', 'awake', 'shout', 'sing', 'glad'],
        medium: ['moderate', 'walking', 'steady', 'walking', 'grace', 'faith'],
        slow: ['solemn', 'prayer', 'quiet', 'slow', 'adagio', 'night', 'still', 'peace', 'rest', 'pity']
    };

    const occasionTags = {
        morning: ['morning', 'dawn', 'sunrise', 'early', 'waking', 'day'],
        evening: ['evening', 'night', 'sunset', 'rest', 'still', 'sleep', 'dark'],
        easter: ['easter', 'resurrection', 'triumph', 'risen', 'calvary', 'cross', 'blood'],
        christmas: ['christmas', 'birth', 'manger', 'advent', 'star', 'born', 'child', 'mary'],
        burial: ['funeral', 'burial', 'death', 'comfort', 'eternal', 'valley', 'home', 'sleep'],
        wedding: ['wedding', 'marriage', 'union', 'love', 'blessing', 'together'],
        praise: ['praise', 'glory', 'hallelujah', 'adoration', 'holy', 'king', 'lord']
    };

    function fuzzyMatch(text, query) {
        if (!query) return 0;
        text = text.toLowerCase().trim();
        query = query.toLowerCase().trim();

        if (text === query) return 100;

        // Exact substring matches get high scores
        if (text.startsWith(query)) return 95;
        if (text.includes(query)) return 85;

        // Fuzzy sequence check for typos (e.g., "Amzing" -> "Amazing")
        let score = 0;
        let textIdx = 0;
        let contiguous = 0;
        let maxContiguous = 0;
        let lastIdx = -1;

        for (let i = 0; i < query.length; i++) {
            const char = query[i];
            const foundIdx = text.indexOf(char, textIdx);

            if (foundIdx !== -1) {
                score++;
                if (lastIdx !== -1 && foundIdx === lastIdx + 1) {
                    contiguous++;
                } else {
                    maxContiguous = Math.max(maxContiguous, contiguous);
                    contiguous = 1;
                }
                lastIdx = foundIdx;
                textIdx = foundIdx + 1;
            } else {
                // Typo tolerance: if a character is missing, we strictly penalize it
                // but still allow the match to continue if the next char is found
                // For a 6-char word, missing 1 char reduces score significantly
            }
        }
        maxContiguous = Math.max(maxContiguous, contiguous);

        // If we found less than 70% of characters, it's probably not a match
        if ((score / query.length) < 0.7) return 0;

        // Base score based on coverage + bonus for the longest contiguous block
        const coverage = (score / query.length) * 40;
        const sequenceBonus = (maxContiguous / query.length) * 30;

        return coverage + sequenceBonus;
    }

    function getHymnAttributes(h) {
        // Cache attributes on the hymn object to speed up filtering
        if (h._computedAttrs) return h._computedAttrs;

        const lyricsText = Array.isArray(h.lyrics)
            ? h.lyrics.map(l => l.text).join(' ')
            : (typeof h.lyrics === 'string' ? h.lyrics : '');
        const content = (h.title + ' ' + (h.author || '') + ' ' + lyricsText).toLowerCase();

        const detectedOccasions = occasionList.filter(occ => {
            const targetTags = occasionTags[occ];
            return targetTags.some(t => {
                if (t.length <= 4) {
                    const regex = new RegExp(`\\b${t}\\b`, 'i');
                    return regex.test(content);
                }
                return content.includes(t);
            });
        });

        const detectedTempos = tempoList.filter(tempo => {
            const targetTags = tempoTags[tempo];
            return targetTags.some(t => {
                if (t.length <= 4) {
                    const regex = new RegExp(`\\b${t}\\b`, 'i');
                    return regex.test(content);
                }
                return content.includes(t);
            });
        });

        // ─── COVERAGE GUARANTEE (FALLBACKS) ───
        // Use deterministic math so the same hymn always has the same falls-backs
        const num = parseInt(h.num || 0) || (h.id ? h.id.length : 0);

        // 1. Ensure every hymn has at least 2 occasions
        if (detectedOccasions.length < 2) {
            const primaryFallback = occasionList[num % occasionList.length];
            const secondaryFallback = occasionList[(num + 3) % occasionList.length];
            if (!detectedOccasions.includes(primaryFallback)) detectedOccasions.push(primaryFallback);
            if (detectedOccasions.length < 2 && !detectedOccasions.includes(secondaryFallback)) detectedOccasions.push(secondaryFallback);
        }

        // 2. Ensure every hymn has exactly 1 primary tempo if not detected
        if (detectedTempos.length === 0) {
            detectedTempos.push(tempoList[num % tempoList.length]);
        }

        h._computedAttrs = { occasions: detectedOccasions, tempos: detectedTempos };
        return h._computedAttrs;
    }

    function matchesAdvanced(h, type, value) {
        if (value === 'all') return true;
        const attrs = getHymnAttributes(h);
        if (type === 'tempo') return attrs.tempos.includes(value);
        if (type === 'occasion') return attrs.occasions.includes(value);
        return true;
    }

    let _searchDebounce = null;
    window.onSearchInput = function (val) {
        // Show/hide clear button
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

        if (_searchDebounce) clearTimeout(_searchDebounce);
        _searchDebounce = setTimeout(() => {
            filterHymns();
        }, 150);
    };

    window.clearSearch = function () {
        const input = document.getElementById('hymnSearch');
        if (input) {
            input.value = '';
            window.onSearchInput('');
        }
    };

    window.onFindClick = function () {
        const btn = document.getElementById('search-btn-main');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Searching...';
            setTimeout(() => {
                btn.textContent = originalText;
                filterHymns(true); // pass true to scroll
            }, 300);
        } else {
            filterHymns(true);
        }
    };

    function filterHymns(shouldScroll = false) {
        const grid = document.getElementById('hymnsGrid');
        const searchInput = document.getElementById('hymnSearch');
        const occasionSelect = document.getElementById('occasionSelect');
        const tempoSelect = document.getElementById('tempoSelect');
        const status = document.getElementById('search-status');
        if (!searchInput || !grid) return;

        const q = searchInput.value.trim().toLowerCase();
        const occasion = occasionSelect ? occasionSelect.value : 'all';
        const tempo = tempoSelect ? tempoSelect.value : 'all';

        const currentHymns = window.hymns_db || hymns;
        let list = currentHymns.map(h => {
            let score = 0;
            if (q) {
                // ... scoring remains the same ...
                const hymnNum = (h.num || h.number || '').toString();
                const paddedNum = hymnNum.padStart(3, '0');
                const unpaddedNum = parseInt(hymnNum, 10).toString();
                let numScore = 0;
                if (paddedNum === q || unpaddedNum === q) numScore = 500;
                else if (paddedNum.startsWith(q) || unpaddedNum.startsWith(q)) numScore = 300;
                else if (paddedNum.includes(q)) numScore = 150;

                const titleScore = fuzzyMatch(h.title || '', q) * 4.0;
                const authorScore = fuzzyMatch(h.author || '', q);
                let contentScore = 0;
                if (h.searchContent) {
                    contentScore = fuzzyMatch(h.searchContent, q) * 0.5;
                    if (h.searchContent.toLowerCase().includes(q)) contentScore = Math.max(contentScore, 30);
                }
                const lyricsText = Array.isArray(h.lyrics) ? h.lyrics.map(l => l.text).join(' ') : '';
                const scriptureScore = lyricsText ? fuzzyMatch(lyricsText, q) * 0.3 : 0;
                score = numScore + Math.max(titleScore, authorScore) + Math.max(contentScore, scriptureScore);
            }
            return { ...h, searchScore: score };
        });

        // Category Filter
        if (activeFilter !== 'all') {
            list = list.filter(h => {
                const hList = Array.isArray(h.tags) ? h.tags : (h.tags || '').split(',').map(t => t.trim().toLowerCase());
                return hList.some(t => typeof t === 'string' && t.toLowerCase().includes(activeFilter.toLowerCase()));
            });
        }

        // Advanced Filters
        list = list.filter(h => matchesAdvanced(h, 'occasion', occasion));
        list = list.filter(h => matchesAdvanced(h, 'tempo', tempo));

        if (q) {
            list = list.filter(h => h.searchScore > 60);
            list.sort((a, b) => b.searchScore - a.searchScore);
            if (status) status.innerHTML = `Searching for "${q}" &bull; <strong>Found ${list.length} hymns</strong>`;
        } else {
            list.sort((a, b) => parseInt(a.num || a.number || 0) - parseInt(b.num || b.number || 0));
            if (status) status.innerHTML = `Showing <strong>${list.length}</strong> hymns in this category`;
        }

        if (list.length === 0) {
            const searchResultsOnly = q ? currentHymns.filter(h => {
                const titleScore = fuzzyMatch(h.title || '', q) * 4.0;
                const authorScore = fuzzyMatch(h.author || '', q) * 1.5;
                const score = Math.max(titleScore, authorScore);
                return score > 60;
            }) : [];

            grid.innerHTML = `
                <div style="grid-column: 1/-1; padding: 100px 20px; text-align: center; color: var(--muted); background: var(--cream); border: 1px dashed var(--border); border-radius: 4px;">
                    <div style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3; color: var(--gold);">✝</div>
                    <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-style: italic; color: var(--ink);">No hymns match your current filters.</p>
                    ${searchResultsOnly.length > 0 ? `
                        <p style="font-size: 0.95rem; margin-top: 12px; color: var(--gold); font-weight: 500;">
                            We found ${searchResultsOnly.length} matches for "${q}", but they are hidden by your current category/filter.
                        </p>
                    ` : `
                        <p style="font-size: 0.9rem; margin-top: 12px; color: var(--muted);">Try adjusting your search or resetting categories.</p>
                    `}
                    <button onclick="window.setFilter(null, 'all', true)" 
                            style="margin-top: 24px; background: var(--gold); border: none; color: var(--warm); padding: 12px 32px; cursor: pointer; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500;">
                        Clear All Filters & See All Matches
                    </button>
                </div>
            `;
        } else {
            renderHymns(list);
        }

        if (shouldScroll && grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function setFilter(btn, f, clearSearch) {
        activeFilter = f;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) {
            btn.classList.add('active');
        } else {
            // Highlight the "All" button by default when no button is passed
            const allBtn = document.querySelector('.filter-btn');
            if (allBtn) allBtn.classList.add('active');
        }
        if (clearSearch) {
            const searchInput = document.getElementById('hymnSearch');
            if (searchInput) searchInput.value = '';
            // Reset dropdowns too
            const occ = document.getElementById('occasionSelect');
            const tempo = document.getElementById('tempoSelect');
            if (occ) occ.value = 'all';
            if (tempo) tempo.value = 'all';
        }
        filterHymns();
    }

    // ══ TTS STATE ══
    let _ttsHymn = null;
    let _ttsSpeaking = false;
    let _ttsPaused = false;
    let _progressInterval = null;
    let _currentTime = 0;
    let _totalDuration = 0;
    let _fontSize = parseInt(localStorage.getItem('hymnFontSize') || '100');
    let _audioObj = null; // Real audio object

    window.changeFontSize = function (delta) {
        _fontSize = Math.max(70, Math.min(150, _fontSize + delta * 10));
        localStorage.setItem('hymnFontSize', _fontSize);
        const lyrics = document.getElementById('m-lyrics');
        if (lyrics) lyrics.style.fontSize = (_fontSize / 100) + 'rem';
    };

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function _updateProgressUI() {
        const fill = document.getElementById('progressFill');
        const currentText = document.getElementById('currentTime');
        const totalText = document.getElementById('totalDuration');
        if (fill) fill.style.width = ((_currentTime / _totalDuration) * 100) + '%';
        if (currentText) currentText.textContent = formatTime(_currentTime);
        if (totalText) totalText.textContent = formatTime(_totalDuration);
    }

    function _startProgress() {
        clearInterval(_progressInterval);
        _progressInterval = setInterval(() => {
            if (_ttsSpeaking && !_ttsPaused) {
                _currentTime += 0.5;
                if (_currentTime >= _totalDuration) {
                    _currentTime = _totalDuration;
                    clearInterval(_progressInterval);
                }
                _updateProgressUI();
            }
        }, 500);
    }

    window.seekAudio = function (e) {
        if (!_ttsHymn || !_totalDuration) return;
        const area = document.getElementById('playerProgressArea');
        if (!area) return;
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));

        _currentTime = _totalDuration * pct;
        _updateProgressUI();

        // Re-start from this ballpark
        if (_ttsSpeaking) {
            window.togglePlay(document.querySelector('.modal-play-btn'), true);
        }
    };

    function openHymn(h) {
        // Stop any ongoing speech when opening a new/different hymn
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (_audioObj) { _audioObj.pause(); _audioObj = null; }
        clearInterval(_progressInterval);
        _ttsHymn = h;
        window._ttsHymn = h;
        _ttsSpeaking = false;
        _ttsPaused = false;
        _currentTime = 0;

        // Duration estimation or loading
        if (h.tuneUrl) {
            _totalDuration = 0; // Will be set when audio loads
        } else {
            const lyricsText = h.lyrics.map(l => l.text).join(' ');
            const wordCount = lyricsText.split(/\s+/).length;
            _totalDuration = Math.max(30, Math.round((wordCount / 150) * 60) + 10);
        }

        const mEyebrow = document.getElementById('m-eyebrow');
        const mTitle = document.getElementById('m-title');
        const mAuthor = document.getElementById('m-author');
        const mLyrics = document.getElementById('m-lyrics');
        const hModal = document.getElementById('hymnModal');
        const scriptureEl = document.getElementById('m-scripture');
        const periodEl = document.getElementById('m-period');

        if (mEyebrow) mEyebrow.textContent = 'Hymn No. ' + h.num;
        if (mTitle) mTitle.textContent = h.title;
        if (mAuthor) mAuthor.textContent = h.author;

        // --- Metadata Extraction ---
        const metadataRegistry = {
            "Amazing Grace": { scripture: "Psalm 103", period: "1779 · England" },
            "It Is Well With My Soul": { scripture: "Psalm 46", period: "1873 · Chicago" },
            "Blessed Assurance": { scripture: "Hebrews 10:22", period: "1873 · USA" },
            "Great Is Thy Faithfulness": { scripture: "Lamentations 3:23", period: "1923 · Kansas" },
            "How Great Thou Art": { scripture: "Psalm 104:1", period: "1885 · Sweden" },
            "Be Thou My Vision": { scripture: "Hebrews 11:1", period: "8th Century · Ireland" },
            "Holy, Holy, Holy": { scripture: "Revelation 4:8", period: "1826 · UK" },
            "Be Still, My Soul": { scripture: "Psalm 46:10", period: "1752 · Germany" }
        };

        let scripture = '';
        let period = '';

        const curated = metadataRegistry[h.title];
        if (curated) {
            scripture = curated.scripture;
            period = curated.period;
        }

        const tagsArr = Array.isArray(h.tags) ? h.tags : (typeof h.tags === 'string' ? h.tags.split(/[,;]\s*/) : []);

        // Fallback Extraction if not curated
        if (!scripture) {
            const bRef = tagsArr.find(t => /\b(ps|psalm|isa|isaiah|jn|john|rev|ex|exodus|matt|rom|heb|gen|prov|ps|jn|lk|mk|mt|cor|acts|phil|col|tim|lam|lamentations)\b/i.test(t) && /\d/.test(t));
            if (bRef) scripture = bRef;
            else {
                const lyricsTextCombined = h.lyrics ? h.lyrics.map(l => l.text).join(' ') : '';
                const match = lyricsTextCombined.match(/\b(Psalm|Isaiah|John|Revelation|Exodus|Matthew|Romans|Hebrews|Genesis|Proverbs|Lamentations)\s+\d+[:\d]*\b/i);
                if (match) scripture = match[0];
                else {
                    const refMatch = lyricsTextCombined.match(/Ref:\s*([A-Za-z\s]+\d+[:\d]*)/i);
                    if (refMatch) scripture = refMatch[1];
                }
            }
        }

        if (!period) {
            if (h.author && h.author.includes('·')) {
                period = h.author.split('·')[1].trim();
            } else if (h.author) {
                const yr = h.author.match(/\d{4}/);
                const cent = h.author.match(/\d+(st|nd|rd|th)\s+Cent/i);
                if (cent) period = cent[0];
                else if (yr) period = yr[0];
            }
        }

        if (scriptureEl) {
            if (scripture) {
                scriptureEl.style.display = 'flex';
                scriptureEl.querySelector('.m-meta-text').textContent = scripture.trim();
            } else { scriptureEl.style.display = 'none'; }
        }

        if (periodEl) {
            if (period) {
                periodEl.style.display = 'flex';
                periodEl.querySelector('.m-meta-text').textContent = period;
            } else { periodEl.style.display = 'none'; }
        }

        let lyricsHTML = '';
        h.lyrics.forEach(l => {
            const cls = l.type === 'refrain' ? 'refrain' : 'stanza';
            lyricsHTML += `<div class="${cls}">${l.text.replace(/\n/g, '<br>')}</div>`;
        });
        if (mLyrics) {
            mLyrics.innerHTML = lyricsHTML;
            mLyrics.style.fontSize = (_fontSize / 100) + 'rem';
        }

        buildWave('modalWave', 22);
        if (hModal) hModal.classList.add('open');

        _updateProgressUI();
        const btn = document.querySelector('.modal-play-btn');
        if (btn) btn.textContent = '▶ Play';

        const favBtn = document.getElementById('modal-fav-btn');
        if (favBtn) {
            const isFav = (window.hymnFavorites || []).includes(h.id);
            favBtn.innerHTML = isFav ? '♥ Saved to Favorites' : '♡ Add to Favorites';
            favBtn.style.color = isFav ? '#d9534f' : '';
        }
    }

    function closeModal() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (_audioObj) { _audioObj.pause(); _audioObj = null; }
        clearInterval(_progressInterval);
        _ttsSpeaking = false; _ttsPaused = false;
        const hModal = document.getElementById('hymnModal');
        if (hModal) hModal.classList.remove('open');
    }

    function showToast(text) {
        const toast = document.getElementById('canticle-toast');
        const toastText = document.getElementById('toast-text');
        if (!toast || !toastText) return;
        toastText.textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    window.closeModal = closeModal;

    window.nextHymn = function () {
        if (!_ttsHymn || !window._currentHymnList) return;
        const currentIdx = window._currentHymnList.findIndex(h => h.id === _ttsHymn.id);
        if (currentIdx !== -1 && currentIdx < window._currentHymnList.length - 1) {
            openHymn(window._currentHymnList[currentIdx + 1]);
        } else {
            showToast("You've reached the end of this list.");
        }
    };

    window.prevHymn = function () {
        if (!_ttsHymn || !window._currentHymnList) return;
        const currentIdx = window._currentHymnList.findIndex(h => h.id === _ttsHymn.id);
        if (currentIdx > 0) {
            openHymn(window._currentHymnList[currentIdx - 1]);
        } else {
            showToast("This is the first hymn in the list.");
        }
    };

    let _isDarkMode = false;
    window.toggleDarkMode = function () {
        const modalContent = document.querySelector('.modal-content');
        if (!modalContent) return;
        _isDarkMode = !_isDarkMode;

        if (_isDarkMode) {
            modalContent.classList.add('dark-mode-active');
            modalContent.style.backgroundColor = '#1a1a1a';
            modalContent.style.color = '#e0e0e0';
            const blocks = modalContent.querySelectorAll('#m-eyebrow, #m-title, #m-author, #m-lyrics, .m-meta-text, .player-label, .player-times, .modal-close, .font-btn');
            blocks.forEach(b => b.style.color = '#e0e0e0');
            const btns = modalContent.querySelectorAll('.pc-btn, .util-btn');
            btns.forEach(b => {
                b.style.backgroundColor = '#333';
                b.style.color = '#fff';
                b.style.borderColor = '#555';
            });
            const btnT = document.querySelector('.font-btn[title="Toggle Dark Mode"]') || document.querySelector('.font-btn[title="Toggle Light Mode"]');
            if (btnT) {
                btnT.textContent = '☀️';
                btnT.setAttribute('title', 'Toggle Light Mode');
            }
        } else {
            modalContent.classList.remove('dark-mode-active');
            modalContent.style.backgroundColor = '';
            modalContent.style.color = '';
            const blocks = modalContent.querySelectorAll('#m-eyebrow, #m-title, #m-author, #m-lyrics, .m-meta-text, .player-label, .player-times, .modal-close, .font-btn');
            blocks.forEach(b => b.style.color = '');
            const btns = modalContent.querySelectorAll('.pc-btn, .util-btn');
            btns.forEach(b => {
                b.style.backgroundColor = '';
                b.style.color = '';
                b.style.borderColor = '';
            });
            const btnT = document.querySelector('.font-btn[title="Toggle Light Mode"]') || document.querySelector('.font-btn[title="Toggle Dark Mode"]');
            if (btnT) {
                btnT.textContent = '🌙';
                btnT.setAttribute('title', 'Toggle Dark Mode');
            }
        }
    };

    // --- PLAYLIST LOGIC ---
    window.addToPlaylist = function (hymnId) {
        if (!hymnId) return;
        const name = prompt("Enter Playlist Name (e.g. Sunday Service, Morning Prayer):", "My Service");
        if (!name) return;

        let playlists = JSON.parse(localStorage.getItem('canticle_playlists') || '{}');
        if (!playlists[name]) playlists[name] = [];

        if (!playlists[name].includes(hymnId)) {
            playlists[name].push(hymnId);
            localStorage.setItem('canticle_playlists', JSON.stringify(playlists));
            showToast(`Added to "${name}"`);
        } else {
            showToast(`Already in "${name}"`);
        }
    };

    window.toggleDarkMode = function () {
        const modalContent = document.querySelector('.modal-content');
        if (!modalContent) return;
        _isDarkMode = !_isDarkMode;

        if (_isDarkMode) {
            modalContent.classList.add('dark-mode-active');
            modalContent.style.backgroundColor = '#1a1a1a';
            modalContent.style.color = '#e0e0e0';
            const blocks = modalContent.querySelectorAll('#m-eyebrow, #m-title, #m-author, #m-lyrics, .m-meta-text, .player-label, .player-times, .modal-close, .font-btn');
            blocks.forEach(b => b.style.color = '#e0e0e0');
            const btns = modalContent.querySelectorAll('.pc-btn, .util-btn');
            btns.forEach(b => {
                b.style.backgroundColor = '#333';
                b.style.color = '#fff';
                b.style.borderColor = '#555';
            });
            const btnT = document.querySelector('.font-btn[title="Toggle Dark Mode"]') || document.querySelector('.font-btn[title="Toggle Light Mode"]');
            if (btnT) {
                btnT.textContent = '☀️';
                btnT.setAttribute('title', 'Toggle Light Mode');
            }
        } else {
            modalContent.classList.remove('dark-mode-active');
            modalContent.style.backgroundColor = '';
            modalContent.style.color = '';
            const blocks = modalContent.querySelectorAll('#m-eyebrow, #m-title, #m-author, #m-lyrics, .m-meta-text, .player-label, .player-times, .modal-close, .font-btn');
            blocks.forEach(b => b.style.color = '');
            const btns = modalContent.querySelectorAll('.pc-btn, .util-btn');
            btns.forEach(b => {
                b.style.backgroundColor = '';
                b.style.color = '';
                b.style.borderColor = '';
            });
            const btnT = document.querySelector('.font-btn[title="Toggle Light Mode"]') || document.querySelector('.font-btn[title="Toggle Dark Mode"]');
            if (btnT) {
                btnT.textContent = '🌙';
                btnT.setAttribute('title', 'Toggle Dark Mode');
            }
        }
    };

    window.openPlaylists = function () {
        const playlists = JSON.parse(localStorage.getItem('canticle_playlists') || '{}');
        const keys = Object.keys(playlists);
        if (keys.length === 0) {
            alert("No playlists found. Open a hymn and click the '+' icon to create one.");
            return;
        }

        let html = '<div style="padding: 20px;">';
        keys.forEach(k => {
            html += `
                <div style="background: #fff; margin-bottom: 12px; padding: 16px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="window.viewPlaylist('${k}')">
                    <div>
                        <h4 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 1.2rem;">📂 ${k}</h4>
                        <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #888;">${playlists[k].length} hymns</p>
                    </div>
                    <button style="background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #d9534f; padding: 8px;" onclick="event.stopPropagation(); window.deletePlaylist('${k}')" title="Delete Playlist">🗑️</button>
                </div>
            `;
        });
        html += '</div>';

        // Use the devotional modal as a container for now
        const devoModal = document.getElementById('devoModal');
        const devoContent = document.getElementById('devoModalContent');
        if (devoModal && devoContent) {
            devoContent.innerHTML = `
                <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; text-align: center; margin-bottom: 24px;">Your Playlists</h2>
                ${html}
            `;
            devoModal.classList.add('open');
        }
    };

    window.deletePlaylist = function (name) {
        if (!confirm(`Are you sure you want to delete the playlist "${name}"?`)) return;

        let playlists = JSON.parse(localStorage.getItem('canticle_playlists') || '{}');
        delete playlists[name];
        localStorage.setItem('canticle_playlists', JSON.stringify(playlists));

        // Refresh the playlists list
        window.openPlaylists();
        showToast(`Deleted "${name}"`);
    };

    window.viewPlaylist = function (name) {
        const playlists = JSON.parse(localStorage.getItem('canticle_playlists') || '{}');
        const ids = playlists[name] || [];
        const playlistHymns = window.hymns_db.filter(h => ids.includes(h.id));

        window._activePlaylistName = name; // Set current context
        renderHymns(playlistHymns);
        window.showPage('hymns');
        closeDevoModal();
        showToast(`Viewing playlist: ${name}`);
    };

    window.removeFromPlaylist = function (playlistName, hymnId) {
        if (!confirm("Remove this hymn from the playlist?")) return;

        let playlists = JSON.parse(localStorage.getItem('canticle_playlists') || '{}');
        if (playlists[playlistName]) {
            playlists[playlistName] = playlists[playlistName].filter(id => id !== hymnId);
            localStorage.setItem('canticle_playlists', JSON.stringify(playlists));

            // Refresh the current view
            window.viewPlaylist(playlistName);
            showToast("Hymn removed");
        }
    };

    function closeDevoModal() {
        const dm = document.getElementById('devoModal');
        if (dm) dm.classList.remove('open');
    }
    window.closeDevoModal = closeDevoModal;



    window.copyLyrics = function () {
        if (!_ttsHymn) return;
        const h = _ttsHymn;
        let text = `${h.num} - ${h.title}\n${h.author}\n\n`;

        const lyricsList = Array.isArray(h.lyrics) ? h.lyrics : [];
        lyricsList.forEach(l => {
            if (l.type === 'refrain') text += '[REFRAIN]\n';
            text += l.text + '\n\n';
        });

        navigator.clipboard.writeText(text.trim()).then(() => {
            showToast('Lyrics copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy', err);
            showToast('Failed to copy lyrics');
        });
    };

    window.shareHymn = async function () {
        if (!_ttsHymn) return;
        const h = _ttsHymn;
        const shareData = {
            title: `${h.num} - ${h.title}`,
            text: `Check out this hymn from the PCC Library: "${h.title}" by ${h.author}.`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for desktop: Copy link
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                showToast('Share link copied to clipboard');
            }
        } catch (err) {
            console.error('Share failed', err);
        }
    };

    function togglePlay(btn, isSeekRestart = false) {
        if (!_ttsHymn) return;

        // ── REAL AUDIO PLAYBACK ──
        if (_ttsHymn.tuneUrl) {
            if (!_audioObj || isSeekRestart) {
                if (_audioObj) _audioObj.pause();
                _audioObj = new Audio(_ttsHymn.tuneUrl);
                _audioObj.addEventListener('loadedmetadata', () => {
                    _totalDuration = _audioObj.duration;
                    _updateProgressUI();
                });
                _audioObj.addEventListener('timeupdate', () => {
                    _currentTime = _audioObj.currentTime;
                    _updateProgressUI();
                });
                _audioObj.addEventListener('ended', () => {
                    _ttsSpeaking = false;
                    btn.textContent = '▶ Play';
                    _setWaveState(false);
                });
            }

            if (_ttsSpeaking && !_ttsPaused) {
                _audioObj.pause();
                _ttsPaused = true;
                btn.textContent = '▶ Play';
                _setWaveState(false);
            } else {
                _audioObj.play().catch(err => {
                    console.error('Audio play failed', err);
                    alert('Failed to play audio. The link might be broken.');
                });
                _ttsSpeaking = true;
                _ttsPaused = false;
                btn.textContent = '⏸ Pause';
                _setWaveState(true);
            }
            return;
        }

        // ── SINGING MODE: TTS line-by-line with organ drone ──
        if (!window.speechSynthesis) {
            alert('Text-to-speech is not supported in your browser.');
            return;
        }
        const synth = window.speechSynthesis;

        if (isSeekRestart) {
            synth.cancel();
            _stopOrganDrone();
            _ttsSpeaking = false;
            _ttsPaused = false;
            _singLineIdx = 0;
        }

        if (_ttsSpeaking && !_ttsPaused) {
            // Pause
            synth.pause();
            _ttsPaused = true;
            btn.textContent = '🎵 Sing';
            _setWaveState(false);
            _pauseOrganDrone();
            return;
        }

        if (_ttsSpeaking && _ttsPaused) {
            // Resume
            synth.resume();
            _ttsPaused = false;
            btn.textContent = '⏸ Pause';
            _setWaveState(true);
            _resumeOrganDrone();
            return;
        }

        // ── Build line-by-line singing structure ──
        synth.cancel();
        const singLines = [];
        // Opening announcement (title only, spoken briefly)
        singLines.push({ text: _ttsHymn.title, isTitle: true });

        _ttsHymn.lyrics.forEach((l, idx) => {
            const lineTexts = l.text.split('\n').filter(s => s.trim());
            if (l.type === 'refrain') {
                singLines.push({ text: 'Refrain', isLabel: true });
            } else {
                singLines.push({ text: 'Verse ' + (idx + 1), isLabel: true });
            }
            lineTexts.forEach(line => singLines.push({ text: line.trim() }));
            singLines.push({ pause: true }); // stanza break
        });

        _singLineIdx = 0;
        _ttsSpeaking = true;
        _ttsPaused = false;
        btn.textContent = '⏸ Pause';
        _setWaveState(true);
        _startProgress();
        _startOrganDrone();

        function _singNext() {
            if (_singLineIdx >= singLines.length || !_ttsSpeaking) {
                if (!_ttsPaused) {
                    _ttsSpeaking = false;
                    btn.textContent = '🎵 Sing';
                    _setWaveState(false);
                    _stopOrganDrone();
                    clearInterval(_progressInterval);
                    _currentTime = _totalDuration;
                    _updateProgressUI();
                }
                return;
            }

            const lineObj = singLines[_singLineIdx++];

            if (lineObj.pause) {
                // Stanza break: longer musical pause
                setTimeout(_singNext, 1100);
                return;
            }

            const utt = new SpeechSynthesisUtterance(lineObj.text);
            utt.lang = 'en-GB';

            // Pick best available voice (favor premium/natural voices)
            const voices = synth.getVoices();
            const preferred = voices.find(v => /natural|premium|samantha|karen|daniel|hazel|zira /i.test(v.name))
                || voices.find(v => /(female|woman)/i.test(v.name) && v.lang.startsWith('en'))
                || voices.find(v => /uk english/i.test(v.name))
                || voices.find(v => v.lang && v.lang.startsWith('en'));
            if (preferred) utt.voice = preferred;

            if (lineObj.isTitle) {
                utt.rate = 0.82;
                utt.pitch = 1.0;
                utt.volume = 0.9;
            } else if (lineObj.isLabel) {
                utt.rate = 0.75;
                utt.pitch = 0.95;
                utt.volume = 0.7;
            } else {
                // Main singing lines: chant-like, deliberate pace, natural pitch
                utt.rate = 0.78;
                utt.pitch = 1.02; // Close to normal to prevent artifacts, slightly elevated for singing feel
                utt.volume = 1.0;
            }

            utt.onend = () => {
                // Advance progress proportionally
                _currentTime = Math.min(_totalDuration, _currentTime + (_totalDuration / Math.max(singLines.length, 1)));
                _updateProgressUI();

                // Make the pause between lines feel like a musical breath
                const pauseMs = lineObj.isTitle ? 800 : lineObj.isLabel ? 400 : 600;
                setTimeout(_singNext, pauseMs);
            };

            utt.onerror = () => {
                setTimeout(_singNext, 200);
            };

            synth.speak(utt);
        }

        _singNext();
    }

    // ── ORGAN DRONE (Web Audio API) ──
    let _singOscCtx = null;
    let _singGainNode = null;
    let _singLineIdx = 0;

    function _startOrganDrone() {
        try {
            if (_singOscCtx) { try { _singOscCtx.close(); } catch (e) { } }
            _singOscCtx = new (window.AudioContext || window.webkitAudioContext)();
            _singGainNode = _singOscCtx.createGain();
            _singGainNode.gain.setValueAtTime(0, _singOscCtx.currentTime);
            _singGainNode.gain.linearRampToValueAtTime(0.045, _singOscCtx.currentTime + 2.0);
            _singGainNode.connect(_singOscCtx.destination);

            // Rich organ pad: Root, Fifth, Octave (C2, G2, C3, G3) 
            // Avoids the third (E) so it doesn't clash with the singing pitch/key
            const frequencies = [65.41, 98.00, 130.81, 196.00];

            frequencies.forEach((freq, i) => {
                // Mix sine and triangle for a warmer, organ-like tone
                const osc = _singOscCtx.createOscillator();
                osc.type = (i % 2 === 0) ? 'triangle' : 'sine';
                osc.frequency.value = freq;

                // Gentle vibrato (chorus effect)
                const vibrato = _singOscCtx.createOscillator();
                vibrato.frequency.value = 4.5 + (i * 0.2); // slight variations
                const vibratoGain = _singOscCtx.createGain();
                vibratoGain.gain.value = freq * 0.006;
                vibrato.connect(vibratoGain);
                vibratoGain.connect(osc.frequency);
                vibrato.start();

                // Low-pass filter to make it sound warm and distant
                const filter = _singOscCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 600;

                osc.connect(filter);
                filter.connect(_singGainNode);
                osc.start();
            });
        } catch (e) {
            // Web Audio not available — silently skip
        }
    }

    function _pauseOrganDrone() {
        try { if (_singOscCtx) _singOscCtx.suspend(); } catch (e) { }
    }

    function _resumeOrganDrone() {
        try { if (_singOscCtx) _singOscCtx.resume(); } catch (e) { }
    }

    function _stopOrganDrone() {
        if (_singGainNode && _singOscCtx) {
            try {
                _singGainNode.gain.linearRampToValueAtTime(0, _singOscCtx.currentTime + 1.2);
                setTimeout(() => {
                    try { if (_singOscCtx) _singOscCtx.close(); } catch (e) { }
                    _singOscCtx = null;
                    _singGainNode = null;
                }, 1300);
            } catch (e) { }
        }
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
    let personalEntries = window.diary_db_personal || [];
    window._diaryMode = 'church'; // Default to official church diary

    function renderDiary(active = 0) {
        const list = document.getElementById('diaryList');
        if (!list) return;

        const sidebarTitle = document.querySelector('.diary-sidebar-title');
        if (sidebarTitle) sidebarTitle.textContent = window._diaryMode === 'church' ? 'Church Diary' : 'My Journal';

        const official = window.diary_db_official || [];
        const currentData = window._diaryMode === 'church' ? official : personalEntries;

        let limitBanner = '';
        if (window._diaryMode === 'personal') {
            const session = window.userSession;
            const sub = session?.user?.subscriptionType || 'FREE';
            let limit = 5;
            if (sub === 'SEEKER') limit = 20;
            else if (sub === 'PILGRIM') limit = 100;
            else if (sub === 'SHEPHERD') limit = 10000;

            const count = personalEntries.length;
            const isFull = count >= limit;
            const percent = Math.min(100, (count / limit) * 100);

            limitBanner = `
                <div style="padding:12px 20px; background:rgba(184,147,90,0.05); border-bottom:1px solid rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:0.65rem; font-weight:700; color:var(--ink2); text-transform:uppercase; letter-spacing:0.05em;">Limit: ${sub} Plan</span>
                        <span style="font-size:0.65rem; font-weight:700; color:${isFull ? 'var(--gold)' : 'var(--muted)'};">${count} / ${limit === 10000 ? '∞' : limit} used</span>
                    </div>
                    <div style="width:100%; height:4px; background:rgba(0,0,0,0.05); border-radius:2px; overflow:hidden;">
                        <div style="width:${percent}%; height:100%; background:${isFull ? 'var(--gold)' : 'var(--ink2)'}; transition:width 0.5s ease;"></div>
                    </div>
                    ${isFull ? `
                        <p style="margin:8px 0 0 0; font-size:0.6rem; color:var(--gold); font-weight:600; cursor:pointer;" onclick="document.querySelector('a[href*=\\'pricing\\']')?.click() || alert('Please visit the pricing section to upgrade.')">Limit reached! Upgrade plan to save more &rarr;</p>
                    ` : ''}
                </div>
            `;
        }

        const tabsHTML = `
            ${limitBanner}
            <div style="display:flex; padding:0 12px; border-bottom:1px solid rgba(0,0,0,0.05); background:rgba(184,147,90,0.02);">
                <button onclick="window.switchDiaryMode('church')" style="flex:1; padding:12px; background:none; border:none; border-bottom: 2px solid ${window._diaryMode === 'church' ? 'var(--gold)' : 'transparent'}; color: ${window._diaryMode === 'church' ? 'var(--gold)' : 'var(--muted)'}; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;">Church</button>
                <button onclick="window.switchDiaryMode('personal')" style="flex:1; padding:12px; background:none; border:none; border-bottom: 2px solid ${window._diaryMode === 'personal' ? 'var(--gold)' : 'transparent'}; color: ${window._diaryMode === 'personal' ? 'var(--gold)' : 'var(--muted)'}; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;">Personal</button>
            </div>
        `;

        if (currentData.length === 0) {
            list.innerHTML = tabsHTML + '<div style="padding:40px; text-align:center; opacity:0.5; font-size:0.9rem;">No entries found.</div>';
            return;
        }

        list.innerHTML = tabsHTML + currentData.map((e, i) => `
            <div class="diary-entry-item ${i === active ? 'active' : ''}" onclick="window.selectEntry(${i})" style="padding: 20px; border-bottom: 1px solid rgba(0,0,0,0.03); cursor: pointer; transition: all 0.3s; background: ${i === active ? 'rgba(184,147,90,0.08)' : 'transparent'}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <span style="font-size:0.7rem; color:var(--muted); letter-spacing:0.05em;">${e.date}</span>
                    ${window._diaryMode === 'personal' ? `<button onclick="event.stopPropagation(); window.deleteDiaryEntry(${i})" style="background:none; border:none; opacity:0.3; cursor:pointer;" title="Delete">🗑️</button>` : ''}
                </div>
                <h4 style="margin: 8px 0 4px 0; font-family:'Cormorant Garamond', serif; font-size:1.1rem; color: ${i === active ? 'var(--gold)' : 'inherit'}">${e.title || 'Untitled'}</h4>
                <p style="margin:0; font-size:0.8rem; opacity:0.6; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;">${e.body || e.theme || 'No theme content'}</p>
            </div>
        `).join('');

        selectEntry(active);
    }

    window.switchDiaryMode = function (mode) {
        window._diaryMode = mode;
        const newBtn = document.querySelector('.new-entry-btn');
        if (newBtn) newBtn.style.display = mode === 'personal' ? 'block' : 'none';
        renderDiary(0);
    };

    window.selectEntry = function (i) {
        const official = window.diary_db_official || [];
        const currentData = window._diaryMode === 'church' ? official : personalEntries;
        if (!currentData[i]) return;
        const e = currentData[i];

        // Update Sidebar Active state
        document.querySelectorAll('.diary-entry-item').forEach((el, idx) => {
            el.style.background = idx === i ? 'rgba(184,147,90,0.08)' : 'transparent';
        });

        const nef = document.getElementById('newEntryForm');
        if (nef) nef.style.display = 'none';
        const mc = document.getElementById('diaryMainContent');
        if (mc) mc.style.display = 'block';

        const container = document.getElementById('diaryEntryContainer');
        if (!container) return;

        if (window._diaryMode === 'church') {
            container.innerHTML = `
                <div style="position:relative; z-index:1;">
                    <p style="color:var(--gold); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.2em; margin-bottom:12px;">Church Diary &bull; ${e.date}</p>
                    <h1 style="font-family:'Cormorant Garamond', serif; font-size:3.5rem; color:var(--ink); margin:0 0 20px 0; line-height:1.1;">${e.title || 'Official Theme'}</h1>
                    <p style="color:var(--gold); font-family:'Cormorant Garamond', serif; font-size:1.8rem; margin-bottom:40px; font-style:italic;">"${e.theme || 'No theme set'}"</p>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; margin-bottom:48px;">
                        ${e.readingOne ? `
                            <div style="background:white; padding:16px; border:1px solid #e8e1d5; border-radius:12px;">
                                <p style="font-size:0.6rem; text-transform:uppercase; color:var(--muted); margin-bottom:4px;">Reading I</p>
                                <p style="font-weight:600; font-size:0.85rem;">${e.readingOne}</p>
                            </div>
                        ` : ''}
                        ${e.readingTwo ? `
                            <div style="background:white; padding:16px; border:1px solid #e8e1d5; border-radius:12px;">
                                <p style="font-size:0.6rem; text-transform:uppercase; color:var(--muted); margin-bottom:4px;">Reading II</p>
                                <p style="font-weight:600; font-size:0.85rem;">${e.readingTwo}</p>
                            </div>
                        ` : ''}
                        ${e.readingThree ? `
                            <div style="background:white; padding:16px; border:1px solid #e8e1d5; border-radius:12px;">
                                <p style="font-size:0.6rem; text-transform:uppercase; color:var(--muted); margin-bottom:4px;">Reading III / Gospel</p>
                                <p style="font-weight:600; font-size:0.85rem;">${e.readingThree}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div style="font-family:'Cormorant Garamond', serif; font-size:1.4rem; line-height:1.8; color:rgba(40,40,40,0.9); margin-bottom:60px;">${e.body || ''}</div>

                    ${e.hymn ? `
                        <div style="display:flex; align-items:center; gap:20px; padding:24px; background:white; border:1px solid #e8e1d5; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.03);">
                            <div style="width:40px; height:40px; background:var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem;">♪</div>
                            <div>
                                <p style="margin:0; font-size:0.7rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.1em;">Suggested Hymn</p>
                                <p style="margin:0; font-weight:600; color:var(--gold);">${e.hymn}</p>
                            </div>
                        </div>
                    ` : ''}
                    <div style="margin-top:60px; display:flex; gap:16px;">
                        <button style="background:var(--gold); color:white; border:none; padding:12px 24px; border-radius:12px; cursor:pointer;" onclick="window.toggleDiarySpeech()">📖 Listen to Theme & Readings</button>
                    </div>
                </div>
            `;
        } else {
            // Personal Mode
            container.innerHTML = `
                <div style="position:relative; z-index:1;">
                    <p style="color:var(--gold); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.2em; margin-bottom:12px;">My Journal &bull; ${e.date}</p>
                    <h1 style="font-family:'Cormorant Garamond', serif; font-size:3.5rem; color:var(--ink); margin:0 0 40px 0; line-height:1;">${e.title || 'Untitled Reflection'}</h1>
                    <div style="font-family:'Cormorant Garamond', serif; font-size:1.5rem; line-height:1.8; color:rgba(40,40,40,0.9); margin-bottom:60px; white-space: pre-wrap;">${e.body}</div>
                    ${e.hymn ? `
                        <div style="display:flex; align-items:center; gap:20px; padding:24px; background:white; border:1px solid #e8e1d5; border-radius:16px;">
                            <div style="width:40px; height:40px; background:var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem;">♪</div>
                            <div><p style="margin:0; font-size:0.7rem; color:var(--muted); text-transform:uppercase;">Inspiration</p><p style="margin:0; font-weight:600; color:var(--gold);">${e.hymn}</p></div>
                        </div>
                    ` : ''}
                    <div style="margin-top:60px; display:flex; gap:16px;">
                        <button style="background:var(--gold); color:white; border:none; padding:12px 24px; border-radius:12px; cursor:pointer; font-weight:600;" onclick="window.toggleDiarySpeech()">📖 Listen to Reflection</button>
                        <button style="background:rgba(184,147,90,0.05); color:var(--gold); border:1px solid rgba(184,147,90,0.2); padding:12px 24px; border-radius:12px; cursor:pointer;" onclick="window.shareByEmail(${i})">✉️ Share reflection</button>
                    </div>
                </div>
            `;
        }
    };

    window.saveDiaryEntry = async function () {
        const title = document.getElementById('newDiaryTitle').value;
        const hymn = document.getElementById('newDiaryHymn').value;
        const body = document.getElementById('newDiaryBody').value;

        if (!title || !body) {
            alert("Please give your reflection a title and write something down.");
            return;
        }

        const session = window.userSession;
        if (!session || !session.user) {
            showToast("Please sign in to save reflections to your personal cloud journal.");
            setTimeout(() => {
                if (confirm("Would you like to sign in now to save your journal entries?")) {
                    window.location.href = '/auth/login';
                }
            }, 500);
            return;
        }

        const newEntry = {
            date: new Date().toISOString(),
            title: title,
            hymn: hymn,
            body: body,
            userId: session.user.id
        };

        try {
            const res = await fetch('/api/diary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry)
            });

            if (res.ok) {
                const saved = await res.json();
                // Format date for display
                saved.date = new Date(saved.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                personalEntries.unshift(saved);

                // Reset form
                document.getElementById('newDiaryTitle').value = '';
                document.getElementById('newDiaryHymn').value = '';
                document.getElementById('newDiaryBody').value = '';

                window.cancelNewEntry();
                renderDiary(0);
                showToast("Reflection saved to your cloud journal.");
            } else {
                const err = await res.json();
                alert("Failed to save: " + (err.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            showToast("Sync error. Please try again.");
        }
    };

    window.deleteDiaryEntry = async function (i) {
        const e = personalEntries[i];
        if (!e) return;
        if (!confirm("Remove this entry from your cloud journal forever?")) return;

        try {
            const res = await fetch(`/api/diary/${e.id}`, { method: 'DELETE' });
            if (res.ok) {
                personalEntries.splice(i, 1);
                renderDiary(0);
                showToast("Entry removed");
            } else {
                showToast("Failed to delete entry.");
            }
        } catch (error) {
            console.error(error);
            showToast("Delete error.");
        }
    }

    window.showNewEntry = function () {
        const mc = document.getElementById('diaryMainContent');
        const nef = document.getElementById('newEntryForm');
        if (mc) mc.style.display = 'none';
        if (nef) nef.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.cancelNewEntry = function () {
        const mc = document.getElementById('diaryMainContent');
        const nef = document.getElementById('newEntryForm');
        if (nef) nef.style.display = 'none';
        if (mc) mc.style.display = 'block';
    }

    let _diarySynth = null;
    let _isDiarySpeaking = false;
    window.toggleDiarySpeech = function () {
        if (_isDiarySpeaking) {
            window.speechSynthesis.cancel();
            _isDiarySpeaking = false;
            showToast("Reading paused.");
            return;
        }

        const container = document.getElementById('diaryEntryContainer');
        if (!container) return;

        // Clean text for speech
        const text = Array.from(container.querySelectorAll('h1, p, div'))
            .filter(el => el.offsetParent !== null) // only visible
            .map(el => el.innerText.trim())
            .filter(t => t.length > 0)
            .slice(0, 10) // Don't take footer elements
            .join('. ');

        if (!text) return;

        _diarySynth = new SpeechSynthesisUtterance(text);
        _diarySynth.rate = 0.95;
        _diarySynth.pitch = 1.05;
        _diarySynth.onend = () => { _isDiarySpeaking = false; };

        window.speechSynthesis.speak(_diarySynth);
        _isDiarySpeaking = true;
        showToast("Reading aloud...");
    };

    window.shareByEmail = function (i) {
        const official = window.diary_db_official || [];
        const currentData = window._diaryMode === 'church' ? official : personalEntries;
        const e = currentData[i];
        if (!e) return;
        const subject = encodeURIComponent(`Reflecting on ${e.title}`);
        const bodyText = encodeURIComponent(`Date: ${e.date}\n\n${e.body}\n\nInspiration: ${e.hymn || 'None'}\n\n---\nShared from Canticle Diary`);
        window.location.href = `mailto:?subject=${subject}&body=${bodyText}`;
    }

    // ══ ECHO DATA ══
    let _echoSearch = '';
    let _echoYear = '';
    let _echoMonth = '';
    let _activeEchoCat = 'all';

    window.onEchoSearch = (val) => { _echoSearch = val; renderEcho(); };
    window.onEchoYearChange = (val) => { _echoYear = val; renderEcho(); };
    window.onEchoMonthChange = (val) => { _echoMonth = val; renderEcho(); };

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

    function renderEcho(filter) {
        if (filter !== undefined) _activeEchoCat = filter;
        const grid = document.getElementById('echoGrid');
        if (!grid) return;
        const eList = getEchoArticles();

        let list = _activeEchoCat === 'all' ? eList : eList.filter(a => a.cat === _activeEchoCat);

        // Apply search filter
        if (_echoSearch) {
            const q = _echoSearch.toLowerCase();
            list = list.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q)
            );
        }

        // Apply year filter
        if (_echoYear && _echoYear !== '') {
            list = list.filter(a => a.date.includes(_echoYear));
        }

        // Apply month filter (Improvement #5)
        if (_echoMonth && _echoMonth !== '') {
            list = list.filter(a => a.date.includes(_echoMonth));
        }

        // Phase 3: Move featured item to top if in "all" or if no other sorting applied
        if (_activeEchoCat === 'all' && !_echoSearch) {
            list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        if (list.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: rgba(0,0,0,0.02); border-radius: 24px; border: 1px dashed rgba(0,0,0,0.1);">
                    <p style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;">🗞️</p>
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--gold); margin-bottom: 8px;">No issues of The Echo found</h3>
                    <p style="color: var(--muted); font-size: 0.9rem;">Check back soon for latest community newsletters and articles.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = list.map((a, i) => {
            const isFeatured = a.isFeatured || (i === 0 && _activeEchoCat === 'all' && !a.isFeatured && !_echoSearch);
            // Store the original index safely
            const db = window.echo_db || [];
            const originalIndex = db.findIndex(item => item.id === a.id);

            return `
            <div class="echo-card ${isFeatured ? 'featured' : ''}" style="position:relative;">
              ${isFeatured ? `
                <div style="position:absolute; top:0; left:0; background:var(--gold); color:white; font-size:10px; font-weight:900; padding:4px 12px; border-bottom-right-radius:12px; z-index:2; text-transform:uppercase; letter-spacing:0.1em;">
                  ★ Issue of the Month
                </div>
              ` : ''}
              ${isFeatured ? `<div class="echo-img-placeholder" style="${a.coverUrl ? `background-image:url(${a.coverUrl}); background-size:cover;` : ''}">
                ${a.coverUrl ? '' : '✝'}
              </div>` : ''}
              <div style="${isFeatured ? '' : 'padding-top:12px;'}">
                <p class="echo-card-cat">${a.cat}</p>
                <h3 class="echo-card-title">${a.title}</h3>
                <p class="echo-card-excerpt">${a.excerpt}</p>
                <div class="echo-card-meta">
                  <div class="echo-avatar">${a.author?.[0] || 'A'}</div>
                  <span class="echo-author">${a.author}</span>
                  <span class="echo-date">· ${a.date}</span>
                </div>
                <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-top:16px; border-top:1px solid rgba(0,0,0,0.05); padding-top:12px;">
                    <span class="echo-read" style="cursor:pointer; font-size:0.85rem; font-weight:600; color:var(--gold); display:flex; align-items:center; gap:4px;" onclick="window.openEchoArticle(${originalIndex})">
                        📖 Read More 
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </div>
              </div>
            </div>`;
        }).join('');
    }

    // Modal System for Echo
    function injectEchoModal() {
        if (document.getElementById('echoModalOverlay')) return;
        const modalHtml = `
            <div id="echoModalOverlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); z-index:9999; display:none; align-items:center; justify-content:center; padding:20px; transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1); opacity:0;">
                <div id="echoModalContent" style="background:#ffffff; width:100%; max-width:800px; max-height:85vh; border-radius:24px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 30px 60px -15px rgba(0,0,0,0.4); border:1px solid rgba(0,0,0,0.1); transform:translateY(30px); transition:all 0.5s cubic-bezier(0.19, 1, 0.22, 1);">
                    <div style="padding:20px 30px; border-bottom:1px solid rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center;">
                        <span id="echoModalCat" style="text-transform:uppercase; font-size:10px; font-weight:900; letter-spacing:0.1em; color:var(--gold);">Category</span>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button id="echoModalShareBtn" onclick="window.shareEchoArticle()" style="background:rgba(184,147,90,0.1); border:none; padding:8px 16px; border-radius:20px; color:var(--gold); font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s;">
                                <span>🔗 Link</span>
                            </button>
                            <button onclick="window.shareEchoWhatsApp()" style="background:#25D366; border:none; padding:8px 12px; border-radius:20px; color:white; font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s;">
                                <span>📲 WhatsApp</span>
                            </button>
                            <button onclick="window.closeEchoModal()" style="background:rgba(0,0,0,0.05); border:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:20px; color:var(--ink1); transition:all 0.2s;">×</button>
                        </div>
                    </div>
                    
                    <div id="echoAudioBar" style="padding:15px 30px; background:rgba(184,147,90,0.08); display:flex; align-items:center; gap:16px; display:none; border-bottom:1px solid rgba(184,147,90,0.1);">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="window.skipEchoAudio(-10)" style="background:none; border:none; color:var(--gold); cursor:pointer; font-size:16px;" title="Back 10s">↺</button>
                            <button id="echoAudioPlayBtn" onclick="window.speakEchoArticle()" style="background:var(--gold); border:none; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; cursor:pointer; font-size:16px; shadow:0 4px 10px rgba(184,147,90,0.3);">▶</button>
                            <button onclick="window.skipEchoAudio(10)" style="background:none; border:none; color:var(--gold); cursor:pointer; font-size:16px;" title="Forward 10s">↻</button>
                        </div>
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <p style="font-size:10px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:0.1em; margin:0;">AI Narrator</p>
                                <span id="echoAudioTime" style="font-size:10px; font-weight:800; color:var(--gold); font-family:monospace;">00:00 / 00:00</span>
                            </div>
                            <div id="echoAudioProgressContainer" onclick="window.seekEchoAudio(event)" style="width:100%; height:6px; background:rgba(184,147,90,0.2); border-radius:3px; cursor:pointer; position:relative;">
                                <div id="echoAudioProgress" style="width:0%; height:100%; background:var(--gold); border-radius:3px; transition:width 0.1s linear; position:relative;">
                                    <div style="position:absolute; right:-6px; top:-3px; width:12px; height:12px; background:var(--gold); border-radius:50%; box-shadow:0 2px 5px rgba(0,0,0,0.2); border:2px solid white;"></div>
                                </div>
                            </div>
                        </div>
                        <button onclick="window.stopEchoAudio()" style="background:rgba(0,0,0,0.04); border:none; color:var(--ink2); font-size:9px; font-weight:900; cursor:pointer; padding:6px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:0.05em;">Stop</button>
                    </div>

                    <div id="echoModalScroll" style="padding:30px 40px; overflow-y:auto; flex:1; scroll-behavior:smooth;">
                        <h1 id="echoModalTitle" style="font-family:'Outfit',sans-serif; font-size:2rem; font-weight:800; color:var(--ink1); line-height:1.2; margin-bottom:12px;">Article Title</h1>
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:30px; padding-bottom:20px; border-bottom:1px solid rgba(0,0,0,0.03);">
                             <div id="echoModalAvatar" style="width:32px; height:32px; border-radius:50%; background:var(--gold); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">A</div>
                             <div>
                                <p id="echoModalAuthor" style="font-size:13px; font-weight:700; color:var(--ink1); margin:0;">Author Name</p>
                                <p id="echoModalDate" style="font-size:11px; color:var(--ink2); opacity:0.6; margin:0;">Date</p>
                             </div>
                        </div>
                        <div id="echoModalBody" style="font-family:'Cormorant Garamond',serif; font-size:1.2rem; line-height:1.8; color:var(--ink2); padding-bottom:40px;">
                            Body content...
                        </div>
                    </div>
                    <div style="padding:20px 40px; border-top:1px solid rgba(0,0,0,0.05); background:rgba(0,0,0,0.01); display:flex; justify-content:center;">
                        <button onclick="window.closeEchoModal()" style="background:var(--ink1); color:white; border:none; padding:12px 30px; border-radius:12px; font-weight:700; font-size:13px; cursor:pointer; transition:all 0.3s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Close Article</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // --- Echo Audio Narrator Global State ---
    let _audioUtterance = null;
    let _audioFullText = "";
    let _audioCurrentSecond = 0;
    let _audioTotalSeconds = 0;
    let _audioTimer = null;
    let _currentEchoId = null;

    const formatEchoTime = (s) => {
        const m = Math.floor(s / 60);
        const secs = Math.floor(s % 60);
        return `${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    window.openEchoArticle = function (index) {
        injectEchoModal();
        const a = window.echo_db[index];
        if (!a) return;
        _currentEchoId = a.id;

        const overlay = document.getElementById('echoModalOverlay');
        const content = document.getElementById('echoModalContent');
        const scroll = document.getElementById('echoModalScroll');
        const audioBar = document.getElementById('echoAudioBar');

        // Reset Share Button
        const shareBtn = document.getElementById('echoModalShareBtn');
        if (shareBtn) shareBtn.innerHTML = '<span>🔗 Link</span>';

        document.getElementById('echoModalCat').innerText = a.cat || a.category || 'NEWS';
        document.getElementById('echoModalTitle').innerText = a.title;
        document.getElementById('echoModalAuthor').innerText = a.author || 'Admin';
        document.getElementById('echoModalDate').innerText = a.date || (a.issueMonth ? new Date(a.issueMonth).toLocaleDateString() : 'Today');
        document.getElementById('echoModalAvatar').innerText = (a.author?.[0] || 'A').toUpperCase();

        const hasFullText = a.fullText && a.fullText.trim().length > 0;
        let bodyHtml = hasFullText
            ? a.fullText.replace(/\n/g, '<br>')
            : `<div style="text-align:center; padding:40px 0; opacity:0.5;">
                <p>Full article text not yet added to digital library.</p>
               </div>`;

        // Improvement #4: Multi-Image Gallery
        let imagesArr = [];
        try {
            imagesArr = typeof a.images === 'string' ? JSON.parse(a.images) : (Array.isArray(a.images) ? a.images : []);
        } catch (e) { imagesArr = []; }

        if (imagesArr.length > 0) {
            const galleryHtml = `
                <div class="echo-gallery" style="display:flex; gap:12px; overflow-x:auto; padding-bottom:20px; margin-bottom:20px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; border-bottom: 1px solid rgba(0,0,0,0.05);">
                    ${imagesArr.filter(url => url && url.trim()).map(img => `
                        <div style="flex:0 0 240px; height:160px; border-radius:14px; overflow:hidden; border:1px solid rgba(0,0,0,0.08); scroll-snap-align:start; box-shadow:0 10px 20px -10px rgba(0,0,0,0.2);">
                            <img src="${img}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://placehold.co/600x400/18181b/ffffff?text=Image+Not+Found'"/>
                        </div>
                    `).join('')}
                </div>
            `;
            // Only prepend if there are valid images
            if (imagesArr.some(u => u && u.trim())) {
                bodyHtml = galleryHtml + bodyHtml;
            }
        }

        document.getElementById('echoModalBody').innerHTML = bodyHtml;

        _audioFullText = hasFullText ? `Heading: ${a.title}. Content: ${a.fullText}` : "";
        _audioTotalSeconds = Math.floor(_audioFullText.length / 15);
        _audioCurrentSecond = 0;
        window.stopEchoAudio(); // Reset UI and state
        updateEchoUI();

        // Only show audio bar if there is content
        if (audioBar) audioBar.style.display = hasFullText ? 'flex' : 'none';

        overlay.style.display = 'flex';
        scroll.scrollTop = 0;

        // Trigger animations
        setTimeout(() => {
            overlay.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 10);

        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    window.shareEchoArticle = function () {
        if (!_currentEchoId) return;
        const publicUrl = `${window.location.origin}/the-echo/${_currentEchoId}`;

        navigator.clipboard.writeText(publicUrl).then(() => {
            const btn = document.getElementById('echoModalShareBtn');
            if (btn) {
                btn.innerHTML = '<span>✅ Copied!</span>';
                setTimeout(() => {
                    btn.innerHTML = '<span>🔗 Link</span>';
                }, 2000);
            }
        }).catch(err => {
            console.error('Copy failed', err);
            alert("Please copy this link: " + publicUrl);
        });
    };

    window.shareEchoWhatsApp = function () {
        if (!_currentEchoId) return;
        const publicUrl = `${window.location.origin}/the-echo/${_currentEchoId}`;
        const title = document.getElementById('echoModalTitle').innerText;
        const waUrl = `https://wa.me/?text=${encodeURIComponent('Read this issue of The Echo: "' + title + '"\n\n' + publicUrl)}`;
        window.open(waUrl, '_blank');
    };

    window.speakEchoArticle = function (seekToSecond = null) {
        const isActuallySpeaking = window.speechSynthesis.speaking;

        // If playing and user clicks "Pause" (without seeking)
        if (isActuallySpeaking && seekToSecond === null) {
            window.speechSynthesis.cancel();
            clearInterval(_audioTimer);
            document.getElementById('echoAudioPlayBtn').innerText = '▶';
            return;
        }

        window.speechSynthesis.cancel();
        clearInterval(_audioTimer);

        if (seekToSecond !== null) _audioCurrentSecond = seekToSecond;
        const charStart = Math.max(0, Math.floor(_audioCurrentSecond * 15));
        const textToRead = _audioFullText.substring(charStart);

        _audioUtterance = new SpeechSynthesisUtterance(textToRead);
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => v.name.includes('Google US English')) ||
            voices.find(v => v.name.includes('Natural')) ||
            voices.find(v => v.lang === 'en-US') ||
            voices[0];

        if (bestVoice) _audioUtterance.voice = bestVoice;
        _audioUtterance.pitch = 1.05;
        _audioUtterance.rate = 0.9;

        _audioUtterance.onend = () => {
            if (!window.speechSynthesis.speaking) {
                if (_audioCurrentSecond >= _audioTotalSeconds - 5) {
                    window.stopEchoAudio();
                }
            }
        };

        // Reliability Fix: Wait 50ms for cancel to clear queues
        setTimeout(() => {
            window.speechSynthesis.speak(_audioUtterance);
            document.getElementById('echoAudioPlayBtn').innerText = '⏸';
            startEchoTimer();
        }, 50);
    };

    function startEchoTimer() {
        clearInterval(_audioTimer);
        _audioTimer = setInterval(() => {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                _audioCurrentSecond++;
                if (_audioCurrentSecond >= _audioTotalSeconds) {
                    window.stopEchoAudio();
                    return;
                }
                updateEchoUI();
            }
        }, 1000);
    }

    function updateEchoUI() {
        const progress = (_audioCurrentSecond / (_audioTotalSeconds || 1)) * 100;
        const bar = document.getElementById('echoAudioProgress');
        if (bar) bar.style.width = progress + '%';

        const timeLabel = document.getElementById('echoAudioTime');
        if (timeLabel) {
            timeLabel.innerText = `${formatEchoTime(_audioCurrentSecond)} / ${formatEchoTime(_audioTotalSeconds)}`;
        }
    }

    window.skipEchoAudio = function (seconds) {
        if (!_audioFullText) return;
        const nextSec = Math.max(0, Math.min(_audioTotalSeconds - 5, _audioCurrentSecond + seconds));
        window.speakEchoArticle(nextSec);
    };

    window.seekEchoAudio = function (event) {
        if (!_audioFullText) return;
        const container = document.getElementById('echoAudioProgressContainer');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const seekTo = Math.floor((percent / 100) * _audioTotalSeconds);
        window.speakEchoArticle(seekTo);
    };

    window.stopEchoAudio = function () {
        window.speechSynthesis.cancel();
        clearInterval(_audioTimer);
        // Removed: _audioCurrentSecond = 0; (User wants it to stay where it stopped)
        updateEchoUI();
        const btn = document.getElementById('echoAudioPlayBtn');
        if (btn) btn.innerText = '▶';
    };

    window.closeEchoModal = function () {
        window.stopEchoAudio();
        const overlay = document.getElementById('echoModalOverlay');
        const content = document.getElementById('echoModalContent');

        overlay.style.opacity = '0';
        content.style.transform = 'translateY(30px)';

        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    };

    function setEchoCat(btn, cat) {
        document.querySelectorAll('.echo-cat').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        renderEcho(cat);
    }


    window.setEchoCat = setEchoCat;
    window.renderEcho = renderEcho;
    window.toggleEcho = function () { console.warn('toggleEcho is deprecated, please refresh page'); };

    function renderDevotional() {
        // 1. Render Archive Grid
        const grid = document.getElementById('devoArchive');
        const dbArchive = window.archive_db || [];

        if (grid) {
            if (dbArchive.length === 0) {
                grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--muted); font-style:italic; padding:40px;">No previous devotionals available.</p>';
            } else {
                grid.innerHTML = dbArchive.map((d, idx) => {
                    // Extract reference for the card
                    const lines = (d.content || '').split('\n');
                    let ref = '';
                    for (let line of lines) {
                        if (line.trim().startsWith('>')) {
                            const text = line.substring(1).trim();
                            if (text.length > 2 && (text === text.toUpperCase() || /^[0-9]?\s?[A-Za-z]+ \d+:\d+/.test(text) || text.toUpperCase().includes('PSALM'))) {
                                ref = text;
                                break;
                            }
                        }
                    }
                    const imgStyle = d.image
                        ? `background-image: linear-gradient(to bottom, rgba(26,21,16,0.1) 0%, rgba(26,21,16,0.75) 100%), url('${d.image}'); background-size: cover; background-position: center;`
                        : `background: linear-gradient(135deg, #1a1510, #2e1f0e);`;
                    return `
                      <div class="devo-arc-card" onclick="window.openArchiveDevotional(window.archive_db[${idx}])" style="position:relative; overflow:hidden; padding:0; border-radius:10px; cursor:pointer; min-height:220px; display:flex; flex-direction:column; justify-content:flex-end;" onmouseover="this.querySelector('.dac-bg').style.transform='scale(1.08)'" onmouseout="this.querySelector('.dac-bg').style.transform='scale(1)'">
                        <div class="dac-bg" style="position:absolute; inset:0; ${imgStyle}; transition: transform 0.4s ease-out;"></div>
                        <div style="position:relative; z-index:1; padding:22px 20px; background: linear-gradient(to top, rgba(20,16,12,0.95) 0%, rgba(20,16,12,0.8) 50%, transparent 100%);">
                          ${d.category ? `<span style="display:inline-block; background:rgba(184,147,90,0.85); color:#fff; font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; padding:3px 10px; border-radius:50px; margin-bottom:8px;">${d.category}</span>` : ''}
                          ${!d.isFree ? `<span style="display:inline-block; background:linear-gradient(135deg, #6e1799, #4a0f66); color:#fff; font-size:0.5rem; letter-spacing:0.15em; text-transform:uppercase; padding:3px 8px; border-radius:4px; margin-left:6px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.1); box-shadow:0 2px 4px rgba(0,0,0,0.2);">💎 Premium</span>` : ''}
                          <p class="dac-date" style="color:rgba(253,250,245,0.6); margin:0 0 4px 0;">${d.date}</p>
                          <p class="dac-title" style="color:#fdfaf5; margin:0 0 4px 0; font-size:1.1rem;">${d.title}</p>
                          <p class="dac-ref" style="color:rgba(253,250,245,0.5); margin-bottom: 8px;">${ref || d.reading || 'Daily Grace'}</p>
                          ${d.excerpt ? `<p style="color:rgba(253,250,245,0.7); font-size:0.75rem; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${d.excerpt}</p>` : ''}
                        </div>
                      </div>`;
                }).join('');
            }
        }

        // 2. Render Current Devotional
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

            // 1. Hero Image (if available) or styled gradient header
            if (d.image) {
                html += `
                    <div class="devo-hero-image" style="
                        width: 100%;
                        height: 380px;
                        background-image: linear-gradient(to bottom, rgba(26,21,16,0.15) 0%, rgba(26,21,16,0.85) 100%), url('${d.image}');
                        background-size: cover;
                        background-position: center;
                        border-radius: 12px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding: 40px 48px;
                        margin-bottom: 40px;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                        position: relative;
                        overflow: hidden;
                    ">
                        ${d.category ? `<span style="
                            display: inline-block;
                            background: rgba(184,147,90,0.85);
                            color: #fff;
                            font-size: 0.6rem;
                            letter-spacing: 0.22em;
                            text-transform: uppercase;
                            padding: 5px 14px;
                            border-radius: 50px;
                            margin-bottom: 14px;
                            width: fit-content;
                            backdrop-filter: blur(4px);
                        ">${d.category}</span>` : ''}
                        <p style="font-size:0.7rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(253,250,245,0.7); margin-bottom:10px;">
                            Today's Devotional &middot; ${d.date} &middot; <span style="color:#b8935a; font-weight:600;">${Math.max(1, Math.ceil((d.content || '').split(' ').length / 200))} MIN READ</span>
                        </p>
                        <h1 style="
                            font-family: 'Cormorant Garamond', serif;
                            font-size: clamp(1.8rem, 4vw, 2.8rem);
                            font-weight: 300;
                            color: #fdfaf5;
                            line-height: 1.2;
                            margin: 0 0 12px 0;
                            text-shadow: 0 2px 12px rgba(0,0,0,0.4);
                        ">${d.title}</h1>
                        <p style="font-size: 0.78rem; color: rgba(253,250,245,0.65); font-weight: 300;">
                            By ${d.author || 'PCC Community'}
                        </p>
                    </div>
                `;
            } else {
                // Fallback: styled gradient header with no image
                html += `
                    <div style="
                        background: linear-gradient(135deg, #1a1510 0%, #2e1f0e 50%, #1a1510 100%);
                        border-radius: 12px;
                        padding: 48px;
                        margin-bottom: 40px;
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="position:absolute;top:-30px;right:-30px;width:200px;height:200px;background:rgba(184,147,90,0.06);border-radius:50%;"></div>
                        <div style="position:absolute;bottom:-50px;left:-20px;width:150px;height:150px;background:rgba(110,23,153,0.06);border-radius:50%;"></div>
                        ${d.category ? `<span style="
                            display: inline-block;
                            background: rgba(184,147,90,0.2);
                            color: #b8935a;
                            font-size: 0.6rem;
                            letter-spacing: 0.22em;
                            text-transform: uppercase;
                            padding: 5px 14px;
                            border-radius: 50px;
                            margin-bottom: 14px;
                            border: 1px solid rgba(184,147,90,0.3);
                        ">${d.category}</span>` : ''}
                        <p style="font-size:0.7rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(253,250,245,0.45); margin-bottom:10px; position:relative; z-index:1;">
                            Today's Devotional &middot; ${d.date} &middot; <span style="color:#b8935a; font-weight:600;">${Math.max(1, Math.ceil((d.content || '').split(' ').length / 200))} MIN READ</span>
                        </p>
                        <h1 style="
                            font-family: 'Cormorant Garamond', serif;
                            font-size: clamp(1.8rem, 4vw, 2.8rem);
                            font-weight: 300;
                            color: #fdfaf5;
                            line-height: 1.2;
                            margin: 0 0 12px 0;
                            position: relative;
                            z-index: 1;
                        ">${d.title}</h1>
                        <p style="font-size: 0.78rem; color: rgba(253,250,245,0.45); font-weight: 300; position:relative; z-index:1;">
                            By ${d.author || 'PCC Community'}
                        </p>
                    </div>
                `;
            }

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

            // Scripture Reading Inline Fetcher (New enhancement!)
            if (d.reading) {
                html += `
                    <div style="text-align: center; margin-bottom: 36px; margin-top: -10px;">
                        <button onclick="window.fetchAndShowScripture('${encodeURIComponent(d.reading)}', this, event)" 
                           style="display:inline-flex; align-items:center; gap:8px; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; color: #b8935a; text-decoration: none; background: rgba(184,147,90,0.05); border: 1px solid rgba(184,147,90,0.3); padding: 8px 20px; border-radius: 50px; text-transform: uppercase; transition: all 0.2s; cursor: pointer;"
                           onmouseover="this.style.background='rgba(184,147,90,0.15)'; this.style.borderColor='rgba(184,147,90,0.6)'"
                           onmouseout="this.style.background='rgba(184,147,90,0.05)'; this.style.borderColor='rgba(184,147,90,0.3)'"
                        >
                            <span style="font-size:1.1rem">📖</span> Read Full Passage: ${d.reading}
                        </button>
                        <div class="inline-scripture-container" style="display:none; text-align: left; background: rgba(26,21,16,0.6); border: 1px solid rgba(184,147,90,0.2); border-radius: 12px; padding: 24px; margin-top: 20px; color: rgba(253,250,245,0.85); font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; line-height: 1.7; max-height: 400px; overflow-y: auto; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                            <!-- scripture injected here -->
                        </div>
                    </div>
                `;
            }

            // Check Access
            let hasAccess = true;
            if (d.isFree === false && window.isPaywallActive !== false) {
                const userPlan = window.subscriptionType || "SEEKER";
                const planLevels = { "SEEKER": 1, "PILGRIM": 2, "SHEPHERD": 3 };
                const reqLevel = planLevels[d.minPlan] || 2;
                const curLevel = planLevels[userPlan] || 1;
                if (curLevel < reqLevel) {
                    hasAccess = false;
                }
            }

            // Reflection
            if (sections.reflection.trim()) {
                html += `
                    <div class="devo-reflection" style="position:relative;">
                        <h3 class="devo-reflection-title">Reflection</h3>
                        <div class="devo-reflection-body">
                `;

                if (hasAccess) {
                    html += `<p>${sections.reflection.trim().replace(/\n\n/g, '</p><p>')}</p></div></div>`;
                } else {
                    const previewText = d.excerpt || (sections.reflection.trim().substring(0, 180) + '...');
                    html += `
                            <p>${previewText}</p>
                            <div style="
                                position: absolute;
                                bottom: -2px; left: 0; right: 0;
                                height: 120px;
                                background: linear-gradient(to bottom, transparent, var(--background) 90%);
                                pointer-events: none;
                            "></div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(184,147,90,0.06); border: 1px solid rgba(184,147,90,0.2); border-radius: 12px; padding: 36px 24px; text-align: center; margin-top: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <div style="font-size:2.2rem; margin-bottom:12px; opacity: 0.9;">🔒</div>
                        <h3 style="font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:#b8935a; margin-bottom:10px;">Premium Devotional</h3>
                        <p style="color:rgba(253,250,245,0.65); font-size:0.9rem; margin-bottom:24px; line-height:1.6; max-width: 400px; margin-left: auto; margin-right: auto;">
                            This devotional requires the <strong style="color:rgba(253,250,245,0.9);">${d.minPlan === 'SHEPHERD' ? 'Shepherd' : 'Pilgrim'}</strong> plan. 
                            Upgrade your faith journey to unlock this full reflection, prayer, and our entire library.
                        </p>
                        <button onclick="window.showPage('subs', document.querySelectorAll('.nav-tab')[5]); if(typeof closeModal === 'function'){closeModal('devoModal');}" 
                            style="background: linear-gradient(135deg, #b8935a, #d4af37); color:#1a1510; border:none; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer; font-size: 0.85rem; letter-spacing: 0.05em; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(184,147,90,0.3);"
                            onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'"
                        >
                            View Subscription Plans
                        </button>
                    </div>
                    `;
                    return html; // Stop rendering prayer and companion hymn
                }
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

            // Companion Hymn Interactive Button
            if (sections.hymn && sections.hymn.trim()) {
                const hymnName = sections.hymn.trim();
                const safeHymnName = hymnName.replace(/'/g, "\\'");
                html += `
                    <div class="devo-reflection" style="margin-top:30px; padding: 24px; background: rgba(184,147,90,0.03); border: 1px solid rgba(184,147,90,0.15); border-radius: 12px; text-align: center;">
                        <h3 class="devo-reflection-title" style="margin-bottom: 12px;">Companion Hymn</h3>
                        <p style="color: rgba(253,250,245,0.6); font-size: 0.85rem; margin-bottom: 16px;">Reflect further by singing today's recommended hymn.</p>
                        <button onclick="window.openCompanionHymn('${safeHymnName}')" 
                            style="background: var(--gold); color: #1a1510; border: none; padding: 10px 24px; border-radius: 50px; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.boxShadow='0 4px 15px rgba(184,147,90,0.4)'; this.style.transform='translateY(-2px)'"
                            onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'"
                        >
                            🎵 Open "${hymnName}"
                        </button>
                    </div>
                `;
            }

            return html;
        }

        currentContainer.innerHTML = parseFullDevotion(d);

        // Remove the static "Daily Devotional" header, we're rendering it dynamically!
        const hero = document.querySelector('.devo-hero');
        if (hero) hero.style.display = 'none';

        // Expose modal handlers
        window.openArchiveDevotional = function (devo) {
            const modal = document.getElementById('devoModal');
            const content = document.getElementById('devoModalContent');
            if (modal && content) {
                content.innerHTML = parseFullDevotion(devo);
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        };

        window.closeDevoModal = function () {
            const modal = document.getElementById('devoModal');
            if (modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        };

        // Helper to parse devotion for modal (re-using the logic)
        window.parseFullDevotion = parseFullDevotion;
    }
    window.renderDevotional = renderDevotional;

    // ══ SUBSCRIPTIONS ══
    const plans = [
        {
            name: 'Seeker', price: { monthly: 0, annual: 0 }, popular: false,
            desc: 'A humble beginning for your spiritual journey. Access core features for free.',
            features: ['Access to 100 free hymns', 'Church Diary (5 entries)', 'Daily Devotional', 'The Echo newsletter'],
            absent: ['Full hymn library (850+)', 'Unlimited diary entries', 'Audio playback', 'Offline access']
        },
        {
            name: 'Pilgrim', price: { monthly: 7, annual: 5 }, popular: true,
            desc: 'Deeper devotion with full access to our growing library and worship tools.',
            features: ['Full hymn library (850+)', 'Unlimited diary entries', 'Audio playback', 'Daily devotionals', 'The Echo — full access', 'Scripture cross-references'],
            absent: ['Offline access']
        },
        {
            name: 'Shepherd', price: { monthly: 18, annual: 12 }, popular: false,
            desc: 'The ultimate experience for leaders and seekers. Complete offline peace and community features.',
            features: ['Everything in Pilgrim', 'Offline access', 'Community groups', 'Share diary entries', 'Priority support', 'Exclusive choir recordings']
        },
    ];

    let billing = 'monthly';
    function renderPlans() {
        const sp = document.getElementById('subPlans');
        if (!sp) return;
        sp.innerHTML = plans.map(p => `
            <div class="sub-plan ${p.popular ? 'featured' : ''}" onmouseenter="this.parentElement.querySelectorAll('.sub-plan').forEach(c=>c.classList.remove('featured'));this.classList.add('featured')">
                ${p.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                <p class="sub-plan-name">${p.name}</p>
                <div class="sub-plan-price">${p.price[billing] === 0 ? 'Free' : '<span>$</span>' + p.price[billing]} ${p.price[billing] !== 0 ? `<span>/ mon</span>` : ''}</div>
                <p class="sub-plan-desc">${p.desc}</p>
                <ul class="sub-features-list">
                    ${p.features.map(f => `<li><span class="sub-check">✓</span> ${f}</li>`).join('')}
                    ${p.absent ? p.absent.map(f => `<li class="off"><span class="sub-check" style="background:rgba(0,0,0,0.1);color:transparent">✓</span> ${f}</li>`).join('') : ''}
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
        modal.style.cssText = `position: fixed; inset: 0; background: rgba(26, 21, 16, .75); backdrop - filter: blur(8px); z - index: 3000; display: flex; align - items: center; justify - content: center; animation:pageIn .3s ease both; `;
        modal.innerHTML = `
                    < div style = "background:#fdfaf5;max-width:480px;width:90%;padding:48px 40px;border:1px solid rgba(184,147,90,.25);position:relative;" >
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
          </div > `;
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
            const modal = document.getElementById('subConfirmModal');
            if (modal) modal.remove();
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
        window.initStickyScroll = initStickyScroll;
        if (window._stickyScrollAdded) return;
        window._stickyScrollAdded = true;

        window.addEventListener('scroll', () => {
            const section = document.querySelector('.sticky-section');
            if (!section) return;

            const panels = document.querySelectorAll('.sticky-panel');
            const cards = document.querySelectorAll('.sticky-card');
            const total = panels.length;
            if (total === 0) return;

            const rect = section.getBoundingClientRect();
            const sectionH = section.offsetHeight;
            if (sectionH <= window.innerHeight) return;

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
        const scrollBar = document.getElementById('scrollBar');
        if (scrollBar) scrollBar.style.width = pct + '%';

        // 2. Parallax cross — subtle drift on scroll
        const cross = document.getElementById('parallaxCross');
        if (cross) cross.style.transform = `translate(-50%, calc(-50% + ${scrollTop * 0.12}px)) rotate(${scrollTop * 0.01}deg)`;

        // 3. Nav shrink on scroll
        const nav = document.querySelector('nav');
        if (nav) {
            if (scrollTop > 60) {
                nav.style.height = '52px';
                nav.style.background = 'rgba(253,250,245,0.98)';
            } else {
                nav.style.height = '64px';
                nav.style.background = 'rgba(253,250,245,0.92)';
            }
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
    const mobNav = document.getElementById('mobileNav');
    if (mobNav && window.innerWidth < 768) {
        mobNav.style.display = 'block';
    }

    // Close modal on bg click
    const hModalBg = document.getElementById('hymnModal');
    if (hModalBg) {
        hModalBg.addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }

    // Expose showPage globally so inline onclick="showPage(...)" handlers still work
    window.showPage = window.showPage || showPage;
    window.setBilling = setBilling;
    window.setFilter = setFilter;
    window.setEchoCat = setEchoCat;
    window.closeModal = closeModal;
    window.openHymn = openHymn;
    window.togglePlay = togglePlay;
    window.filterHymns = filterHymns;
    window.showNewEntry = showNewEntry;
    window.cancelNewEntry = cancelNewEntry;
    window.toggleEcho = toggleEcho;
    window.selectEntry = selectEntry;
    window.renderHymns = renderHymns;
    window.onSearchInput = onSearchInput;
    window.onFindClick = onFindClick;
    window.clearSearch = clearSearch;
    // Subscription handlers
    window.handleSubscribe = handleSubscribe;
    window.confirmSubscribe = confirmSubscribe;

    // ══ SCRIPTURE INLINE FETCHER ══
    window.fetchAndShowScripture = async function (reference, btn, event) {
        event.preventDefault();
        const container = btn.nextElementSibling;

        // Toggle visibility if already fetched
        if (container.style.display === 'block') {
            container.style.display = 'none';
            btn.innerHTML = `<span style="font-size:1.1rem">📖</span> Read Full Passage: ${decodeURIComponent(reference)}`;
            return;
        }

        container.style.display = 'block';

        // If already populated, just show it
        if (container.innerHTML.trim() !== '<!-- scripture injected here -->') {
            btn.innerHTML = `<span style="font-size:1.1rem">📖</span> Hide Passage`;
            return;
        }

        // Fetching state
        btn.innerHTML = `<span style="font-size:1.1rem">⏳</span> Fetching...`;
        container.innerHTML = `<p style="text-align:center; color:rgba(253,250,245,0.5); font-style:italic;">Loading divine words...</p>`;

        try {
            const res = await fetch(`https://bible-api.com/${reference}`);
            if (!res.ok) throw new Error("Bible API error");
            const data = await res.json();

            // Format verses
            let textHtml = `<h4 style="color:#b8935a; margin-top:0; font-size:1.3rem;">${data.reference}</h4>`;

            data.verses.forEach(v => {
                textHtml += `<p style="margin-bottom:8px;"><sup style="color:rgba(184,147,90,0.8); font-size:0.75rem; font-family:'Jost',sans-serif; font-weight:500; margin-right:6px;">${v.verse}</sup>${v.text}</p>`;
            });

            textHtml += `<p style="font-size:0.7rem; color:rgba(253,250,245,0.4); text-align:right; margin-top:16px; font-family:'Jost',sans-serif; text-transform:uppercase; letter-spacing:0.1em;">${data.translation_name}</p>`;

            container.innerHTML = textHtml;
            btn.innerHTML = `<span style="font-size:1.1rem">📖</span> Hide Passage`;
        } catch (err) {
            container.innerHTML = `<p style="text-align:center; color:#c0392b;">Failed to load scripture. Please check your connection or try again later.</p>`;
            btn.innerHTML = `<span style="font-size:1.1rem">📖</span> Try Again`;
        }
    };

    // ══ COMPANION HYMN OPENER ══
    // Searches the hymn library for the named hymn and opens it directly in the modal.
    window.openCompanionHymn = function (hymnName) {
        const db = window.hymns_db || [];
        if (!hymnName || db.length === 0) {
            // Fall back: switch to hymns page and pre-fill the search
            window.showPage('hymns', document.querySelectorAll('.nav-tab')[1]);
            setTimeout(() => {
                const inp = document.getElementById('hymnSearch');
                if (inp) { inp.value = hymnName; window.onSearchInput(hymnName); }
            }, 200);
            return;
        }

        const query = hymnName.toLowerCase().trim();

        // 1. Exact title match
        let found = db.find(h => (h.title || '').toLowerCase() === query);

        // 2. Starts-with match
        if (!found) found = db.find(h => (h.title || '').toLowerCase().startsWith(query));

        // 3. Partial match
        if (!found) found = db.find(h => (h.title || '').toLowerCase().includes(query));

        // 4. Word-by-word fuzzy
        if (!found) {
            const words = query.split(/\s+/).filter(w => w.length > 2);
            found = db.find(h => words.some(w => (h.title || '').toLowerCase().includes(w)));
        }

        if (found) {
            // Close the devo modal first if open
            const devoModal = document.getElementById('devoModal');
            if (devoModal && devoModal.classList.contains('open')) {
                devoModal.classList.remove('open');
                document.body.style.overflow = '';
            }
            // Switch to hymns page (silently, no scroll) then open the hymn
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const hymnsPage = document.getElementById('page-hymns');
            if (hymnsPage) hymnsPage.classList.add('active');
            document.querySelectorAll('.nav-tab').forEach((t, i) => t.classList.toggle('active', i === 1));
            setTimeout(() => window.openHymn(found), 100);
        } else {
            // Not found — fallback to search
            window.showPage('hymns', document.querySelectorAll('.nav-tab')[1]);
            setTimeout(() => {
                const inp = document.getElementById('hymnSearch');
                if (inp) { inp.value = hymnName; window.onSearchInput(hymnName); }
            }, 200);
        }
    };

    // ─── PART 8: GLOBAL MASTER SEARCH ─────────────────────────────────────────
    // This provides a powerful global modal to search across all app data types.

    window.openMasterSearch = () => {
        let modal = document.getElementById('masterSearchModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'masterSearchModal';
            modal.style = `
                position: fixed; inset: 0; z-index: 10000; display: none;
                background: rgba(10, 8, 6, 0.9); backdrop-filter: blur(12px);
                align-items: flex-start; justify-content: center; padding-top: 80px;
                transition: opacity 0.3s; opacity: 0;
            `;
            modal.innerHTML = `
                <div style="width: 100%; max-width: 700px; padding: 0 20px;">
                    <div style="display: flex; align-items: center; border-bottom: 2px solid var(--gold); padding: 10px 0; margin-bottom: 30px;">
                        <span style="font-size: 1.5rem; margin-right: 15px; opacity: 0.6;">🔍</span>
                        <input type="text" id="masterSearchInput" placeholder="Search Hymns, Echo, Devotionals..." style="
                            width: 100%; background: transparent; border: none; color: #fff;
                            font-family: 'Cormorant Garamond', serif; font-size: 2rem; outline: none;
                        " autocomplete="off">
                        <button onclick="window.closeMasterSearch()" style="background:none; border:none; color:rgba(253,250,245,0.4); cursor:pointer; font-size:1.5rem;">&times;</button>
                    </div>
                    <div id="masterSearchResults" style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">
                        <p style="color: rgba(253,250,245,0.4); text-align: center; font-style: italic; margin-top: 50px;">Start typing to search across the entire library...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            const input = document.getElementById('masterSearchInput');
            input.oninput = (e) => window.onGlobalSearch(e.target.value);
            input.onkeydown = (e) => { if (e.key === 'Escape') window.closeMasterSearch(); };
        }

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            document.getElementById('masterSearchInput').focus();
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    window.closeMasterSearch = () => {
        const modal = document.getElementById('masterSearchModal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    };

    window.onGlobalSearch = (q) => {
        const query = q.toLowerCase().trim();
        const resultsBox = document.getElementById('masterSearchResults');
        if (!query) {
            resultsBox.innerHTML = '<p style="color: rgba(253,250,245,0.4); text-align: center; font-style: italic; margin-top: 50px;">Start typing to find content...</p>';
            return;
        }

        // Fuzzy Match Helper: Handles typos with 1-character tolerance
        const isFuzzy = (target, search) => {
            if (!target || !search) return false;
            const t = target.toLowerCase();
            const s = search.toLowerCase();
            if (t.includes(s)) return true;
            if (s.length < 3) return false;

            // Check segments for 1-char difference
            for (let i = 0; i <= t.length - s.length; i++) {
                const sub = t.substring(i, i + s.length);
                let diff = 0;
                for (let j = 0; j < s.length; j++) {
                    if (sub[j] !== s[j]) diff++;
                    if (diff > 1) break;
                }
                if (diff <= 1) return true;
            }
            return false;
        };

        // Search Hymns (Titles & Lyrics)
        const hymnResults = (window.hymns_db || []).filter(h => 
            isFuzzy(h.title, query) || isFuzzy(h.lyricText, query)
        ).slice(0, 5);

        // Search Echo (Titles & Content)
        const echoResults = (window.echo_db || []).filter(e => 
            isFuzzy(e.title, query) || isFuzzy(e.content, query)
        ).slice(0, 5);

        // Search Devotionals (Titles & Content)
        const devoResults = (window.archive_db || []).filter(d => 
            isFuzzy(d.title, query) || isFuzzy(d.content, query)
        ).slice(0, 5);

        let html = '';
        if (hymnResults.length > 0 || echoResults.length > 0 || devoResults.length > 0) {
            // ... (Rest of rendering logic remains the same)
            if (hymnResults.length > 0) {
                html += `<div style="margin-bottom: 40px;">
                    <h3 style="color: var(--gold); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 15px;">Hymns Library</h3>`;
                hymnResults.forEach(h => {
                    html += `
                        <div onclick="window.closeMasterSearch(); window.openHymn(${JSON.stringify(h).replace(/"/g, '&quot;')})" style="padding: 15px; background: rgba(253,250,245,0.03); border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                            <p style="color: #fff; font-size: 1.1rem; margin: 0 0 4px 0;">${h.title}</p>
                            <p style="color: rgba(253,250,245,0.4); font-size: 0.75rem;">${h.num ? 'Hymn #' + h.num : 'Hymn'}</p>
                        </div>`;
                });
                html += `</div>`;
            }

            if (echoResults.length > 0) {
                html += `<div style="margin-bottom: 40px;">
                    <h3 style="color: var(--gold); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 15px;">The Echo Library</h3>`;
                echoResults.forEach(e => {
                    html += `
                        <div onclick="window.closeMasterSearch(); window.openEchoModal(${JSON.stringify(e).replace(/"/g, '&quot;')})" style="padding: 15px; background: rgba(253,250,245,0.03); border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                            <p style="color: #fff; font-size: 1.1rem; margin: 0 0 4px 0;">${e.title}</p>
                            <p style="color: rgba(253,250,245,0.4); font-size: 0.75rem;">${e.author || 'PCC Admin'}</p>
                        </div>`;
                });
                html += `</div>`;
            }

            if (devoResults.length > 0) {
                html += `<div style="margin-bottom: 40px;">
                    <h3 style="color: var(--gold); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 15px;">Devotionals</h3>`;
                devoResults.forEach(d => {
                    html += `
                        <div onclick="window.closeMasterSearch(); window.openArchiveDevotional(${JSON.stringify(d).replace(/"/g, '&quot;')})" style="padding: 15px; background: rgba(253,250,245,0.03); border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                            <p style="color: #fff; font-size: 1.1rem; margin: 0 0 4px 0;">${d.title}</p>
                            <p style="color: rgba(253,250,245,0.4); font-size: 0.75rem;">${d.date}</p>
                        </div>`;
                });
                html += `</div>`;
            }
        } else {
            html = `<p style="color: rgba(253,250,245,0.4); text-align: center; margin-top: 50px;">No exact or approximate matches found for "${q}".</p>`;
        }

        resultsBox.innerHTML = html;
    };

    // ─── PART 9: USER PROFILE HUB ─────────────────────────────────────────────
    // A comprehensive hub for users to manage their data, favorites, and settings.

    window.renderProfileHub = () => {
        const session = window.userSession;
        if (!session) { window.location.href = '/auth/login'; return; }

        const container = document.getElementById('page-profile');
        if (!container) return;

        window.showPage('profile', document.querySelector('.nav-right [title="My Profile"]'));

        const stats = {
            favorites: (window.hymnFavorites || []).length,
            entries: (window.diary_db_personal || []).length,
            role: session.user.role || 'Member'
        };

        container.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; width: 100%; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 60px;">
                    <div style="width: 100px; height: 100px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2.5rem; color: #1a1510;">
                        ${session.user.name ? session.user.name.charAt(0) : '👤'}
                    </div>
                    <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: var(--ink); font-weight: 300;">${session.user.name || 'Sacred Member'}</h1>
                    <p style="color: var(--muted); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase;">${stats.role} &bull; ${session.user.email}</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 60px;">
                    <div style="background: rgba(184,147,90,0.05); border: 1px solid rgba(184,147,90,0.1); border-radius: 20px; padding: 30px; text-align: center;">
                        <p style="text-transform: uppercase; font-size: 0.65rem; color: #6e1799; letter-spacing: 0.2em; margin-bottom: 10px;">Favorite Hymns</p>
                        <p style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: var(--ink);">${stats.favorites}</p>
                        <button onclick="window.renderProfileFavorites()" style="margin-top: 15px; background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.75rem;">View All</button>
                    </div>
                    <div style="background: rgba(184,147,90,0.05); border: 1px solid rgba(184,147,90,0.1); border-radius: 20px; padding: 30px; text-align: center;">
                        <p style="text-transform: uppercase; font-size: 0.65rem; color: #6e1799; letter-spacing: 0.2em; margin-bottom: 10px;">Journal Entries</p>
                        <p style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: var(--ink);">${stats.entries}</p>
                        <button onclick="window.exportDiaryToPDF()" style="margin-top: 15px; background: var(--gold); border: none; color: #1a1510; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">Export PDF</button>
                    </div>
                    <div style="background: rgba(184,147,90,0.05); border: 1px solid rgba(184,147,90,0.1); border-radius: 20px; padding: 30px; text-align: center;">
                        <p style="text-transform: uppercase; font-size: 0.65rem; color: #6e1799; letter-spacing: 0.2em; margin-bottom: 10px;">Account Tier</p>
                        <p style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: var(--ink);">${window.subscriptionType || 'Free Tier'}</p>
                        <button onclick="window.showPage('subs', document.querySelectorAll('.nav-tab')[5])" style="margin-top: 15px; background: transparent; border: 1px solid rgba(0,0,0,0.1); color: var(--muted); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.75rem;">Manage Plan</button>
                    </div>
                </div>

                <div style="padding: 40px; background: rgba(184,147,90,0.03); border: 1px solid rgba(184,147,90,0.1); border-radius: 24px; margin-bottom: 60px;">
                    <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; margin-bottom: 25px; color: #1a1510;">Guidance for Your Spiritual Journey</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                        <div>
                            <h3 style="font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; font-weight: 700;">The Sacred Journal</h3>
                            <p style="font-size: 0.88rem; color: var(--muted); line-height: 1.7;">Your Journal is a private, encrypted oasis where you can record personal prayers, reflections on devotionals, or intimate thoughts. These entries are tied exclusively to your account, serving as a digital landscape of your faith walk over time.</p>
                        </div>
                        <div>
                            <h3 style="font-size: 0.8rem; color: var(--gold); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; font-weight: 700;">Spiritual Export (PDF)</h3>
                            <p style="font-size: 0.88rem; color: var(--muted); line-height: 1.7;">The <strong>Export PDF</strong> tool is designed to bridge the gap between your digital and physical spiritual life. With one click, we typeset your entire history of journal entries into a beautiful, printable document to preserve your testimony for years to come.</p>
                        </div>
                    </div>
                </div>

                <div id="profileSubContent"></div>
            </div>
        `;
    };

    window.renderProfileFavorites = () => {
        const sub = document.getElementById('profileSubContent');
        if (!sub) return;

        const favIds = window.hymnFavorites || [];
        const favHymns = (window.hymns_db || []).filter(h => favIds.includes(String(h.id)));

        let html = `
            <div style="border-top: 1px solid rgba(184,147,90,0.1); padding-top: 40px;">
                <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; margin-bottom: 25px;">Saved for Reflection</h2>
        `;

        if (favHymns.length === 0) {
            html += `<p style="color: var(--muted); font-style: italic;">Your favorites library is currently empty.</p>`;
        } else {
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">`;
            favHymns.forEach(h => {
                html += `
                    <div style="padding: 20px; background: #fff; border: 1px solid #f0e6d6; border-radius: 12px; position: relative;">
                        <p style="font-size: 0.6rem; color: var(--gold); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Hymn #${h.num || '?'}</p>
                        <h4 style="font-size: 1rem; color: var(--ink); margin: 0 0 12px 0;">${h.title}</h4>
                        <button onclick="window.openHymn(${JSON.stringify(h).replace(/"/g, '&quot;')})" style="background: none; border: 1px solid #f0e6d6; color: var(--muted); padding: 5px 12px; border-radius: 50px; font-size: 0.7rem; cursor: pointer;">Open Now</button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;
        sub.innerHTML = html;
        sub.scrollIntoView({ behavior: 'smooth' });
    };

    window.exportDiaryToPDF = () => {
        const entries = window.diary_db_personal || [];
        if (entries.length === 0) {
            alert("No journal entries found to export!");
            return;
        }

        // We use a styled print approach as a clever hack for PDF export
        const printWindow = window.open('', '_blank');
        let html = `
            <html>
                <head>
                    <title>My Sacred Journal - PCC Canticle</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@300;400&display=swap');
                        body { font-family: 'Inter', sans-serif; color: #1a1510; padding: 40px; line-height: 1.6; }
                        h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; border-bottom: 1px solid #b8935a; padding-bottom: 10px; text-align: center; }
                        .entry { margin-bottom: 40px; page-break-inside: avoid; }
                        .date { font-weight: 600; font-size: 12px; color: #b8935a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
                        .title { font-family: 'Cormorant Garamond', serif; font-size: 24px; margin: 0 0 10px 0; }
                        .content { font-size: 14px; text-align: justify; }
                        footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #999; }
                        @media print { .no-print { display: none !important; } }
                        .no-print {
                            position: fixed; top: 0; left: 0; right: 0;
                            background: rgba(26, 21, 16, 0.95); padding: 10px 40px;
                            display: flex; justify-content: flex-end; align-items: center;
                            z-index: 1000;
                        }
                        .export-btn {
                            background: #6e1799; color: white; border: none;
                            padding: 10px 24px; border-radius: 6px; cursor: pointer;
                            font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px;
                            transition: all 0.3s;
                        }
                        .export-btn:hover { background: #4e0779; transform: translateY(-1px); }
                    </style>
                </head>
                <body style="padding-top: 80px;">
                    <div class="no-print">
                        <button class="export-btn" onclick="window.print()">📥 Download PDF / Print Journal</button>
                    </div>
                    <h1>My Sacred Journal</h1>
                    <p style="text-align: center; font-size: 12px; margin-bottom: 50px;">Personal reflections from the Canticle community</p>
        `;

        entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(e => {
            html += `
                <div class="entry">
                    <div class="date">${e.date}</div>
                    <h2 class="title">${e.title || 'Journal Entry'}</h2>
                    <div class="content">${(e.body || '').replace(/\n/g, '<br>')}</div>
                </div>
            `;
        });

        html += `
                    <footer>Generated on ${new Date().toLocaleDateString()} &bull; PCC Canticle Library</footer>
                </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

})();
