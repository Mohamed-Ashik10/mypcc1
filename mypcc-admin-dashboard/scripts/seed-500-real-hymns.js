const { PrismaClient } = require('@prisma/client');
const https = require('https');
const dns = require('dns');

// Fix for TiDB Cloud connection issues
dns.setDefaultResultOrder('ipv4first');

const prisma = new PrismaClient();

async function fetchGhsHymns() {
    return new Promise((resolve, reject) => {
        const url = 'https://raw.githubusercontent.com/marvinjude/gospel-hymns/master/content/db.json';
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(Object.values(json.hymns));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function getAdditionalHymns() {
    return [
        {
            "title": "Abide With Me",
            "verses": [
                "Abide with me; fast falls the eventide;\nThe darkness deepens; Lord, with me abide;\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me.",
                "Swift to its close ebbs out life's little day;\nEarth's joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me.",
                "I need Thy presence every passing hour;\nWhat but Thy grace can foil the tempter's power?\nWho, like Thyself, my guide and stay can be?\nThrough cloud and sunshine, Lord, abide with me.",
                "I fear no foe, with Thee at hand to bless;\nIlls have no weight, and tears no bitterness;\nWhere is death's sting? Where, grave, thy victory?\nI triumph still, if Thou abide with me.",
                "Hold Thou Thy cross before my closing eyes;\nShine through the gloom and point me to the skies;\nHeaven's morning breaks, and earth's vain shadows flee;\nIn life, in death, O Lord, abide with me."
            ],
            "category": "Hope & Comfort"
        },
        {
            "title": "A Mighty Fortress Is Our God",
            "verses": [
                "A mighty fortress is our God, a bulwark never failing;\nOur helper He, amid the flood of mortal ills prevailing:\nFor still our ancient foe doth seek to work us woe;\nHis craft and power are great, and, armed with cruel hate,\nOn earth is not his equal.",
                "Did we in our own strength confide, our striving would be losing;\nWere not the right Man on our side, the Man of God's own choosing:\nDost ask who that may be? Christ Jesus, it is He;\nLord Sabaoth, His Name, from age to age the same,\nAnd He must win the battle.",
                "And though this world, with devils filled, should threaten to undo us,\nWe will not fear, for God hath willed His truth to triumph through us:\nThe Prince of Darkness grim, we tremble not for him;\nHis rage we can endure, for lo, his doom is sure,\nOne little word shall fell him.",
                "That word above all earthly powers, no thanks to them, abideth;\nThe Spirit and the gifts are ours through Him Who with us sideth:\nLet goods and kindred go, this mortal life also;\nThe body they may kill: God's truth abideth still,\nHis kingdom is forever."
            ],
            "category": "Faith & Trust"
        },
        {
            "title": "All Hail the Power of Jesus' Name",
            "verses": [
                "All hail the power of Jesus' Name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all.",
                "Crown Him, ye martyrs of your God,\nWho from His altar call;\nExtol the Stem of Jesse's Rod,\nAnd crown Him Lord of all.",
                "Ye seed of Israel's chosen race,\nYe ransomed from the fall,\nHail Him Who saves you by His grace,\nAnd crown Him Lord of all.",
                "Sinners, whose love can ne'er forget\nThe wormwood and the gall,\nGo, spread your trophies at His feet,\nAnd crown Him Lord of all.",
                "Let every kindred, every tribe,\nOn this terrestrial ball,\nTo Him all majesty ascribe,\nAnd crown Him Lord of all.",
                "O that with yonder sacred throng\nWe at His feet may fall!\nWe'll join the everlasting song,\nAnd crown Him Lord of all."
            ],
            "category": "Praise"
        },
        {
            "title": "All People That on Earth Do Dwell",
            "verses": [
                "All people that on earth do dwell,\nSing to the Lord with cheerful voice;\nHim serve with fear, His praise forthtell,\nCome ye before Him, and rejoice.",
                "The Lord, ye know, is God indeed;\nWithout our aid He did us make;\nWe are His folk, He doth us feed,\nAnd for His sheep He doth us take.",
                "O enter then His gates with praise,\nApproach with joy His courts unto;\nPraise, laud, and bless His Name always,\nFor it is seemly so to do.",
                "For why? the Lord our God is good;\nHis mercy is forever sure;\nHis truth at all times firmly stood,\nAnd shall from age to age endure.",
                "To Father, Son, and Holy Ghost,\nThe God Whom heaven and earth adore,\nFrom men and from the angel-host\nBe praise and glory evermore."
            ],
            "category": "Praise"
        },
        {
            "title": "Amazing Grace",
            "verses": [
                "Amazing grace! how sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
                "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!",
                "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
                "The Lord has promised good to me,\nHis word my hope secures;\nHe will my shield and portion be\nAs long as life endures.",
                "Yes, when this flesh and heart shall fail,\nAnd mortal life shall cease,\nI shall possess, within the veil,\nA life of joy and peace.",
                "The earth shall soon dissolve like snow,\nThe sun forbear to shine;\nBut God, who called me here below,\nWill be forever mine."
            ],
            "category": "Grace"
        },
        {
            "title": "Angels We Have Heard on High",
            "verses": [
                "Angels we have heard on high\nSweetly singing o'er the plains,\nAnd the mountains in reply\nEchoing their joyous strains.",
                "Shepherds, why this jubilee?\nWhy your joyous strains prolong?\nWhat the gladsome tidings be\nWhich inspire your heavenly song?",
                "Come to Bethlehem and see\nHim Whose birth the angels sing;\nCome, adore on bended knee,\nChrist the Lord, the newborn King.",
                "See Him in a manger laid,\nWhom the choirs of angels praise;\nMary, Joseph, lend your aid,\nWhile our hearts in love we raise."
            ],
            "chorus": "Gloria, in excelsis Deo!\nGloria, in excelsis Deo!",
            "category": "Christmas"
        },
        {
            "title": "As with Gladness Men of Old",
            "verses": [
                "As with gladness men of old\nDid the guiding star behold;\nAs with joy they hailed its light,\nLeading onward, beaming bright;\nSo, most gracious Lord, may we\nEvermore be led to Thee.",
                "As with joyful steps they sped\nTo that lowly manger-bed,\nThere to bend the knee before\nHim Whom heaven and earth adore;\nSo may we with willing feet\nEver seek Thy mercy-seat.",
                "As they offered gifts most rare\nAt that manger rude and bare;\nSo may we with holy joy,\nPure and free from sin's alloy,\nAll our costliest treasures bring,\nChrist, to Thee, our heavenly King.",
                "Holy Jesus, every day\nKeep us in the narrow way;\nAnd, when earthly things are past,\nBring our ransomed souls at last\nWhere they need no star to guide,\nWhere no clouds Thy glory hide."
            ],
            "category": "Christmas"
        },
        {
            "title": "At Even, Ere the Sun Was Set",
            "verses": [
                "At even, ere the sun was set,\nThe sick, O Lord, around Thee lay;\nOh, in what divers pains they met!\nOh, with what joy they went away!",
                "Once more 'tis eventide, and we\nOppressed with various ills draw near;\nWhat if Thy form we cannot see?\nWe know and feel that Thou art here.",
                "O Saviour Christ, our woes dispel;\nFor some are sick, and some are sad,\nAnd some have never loved Thee well,\nAnd some have lost the love they had.",
                "And some have found the world is vain,\nYet from the world they break not free;\nAnd some have friends who give them pain,\nYet have not sought a friend in Thee.",
                "And none, O Lord, have perfect rest,\nFor none are wholly free from sin;\nAnd they who fain would serve Thee best\nAre conscious most of wrong within.",
                "Thy touch has still its ancient power;\nNo word from Thee can fruitless fall;\nHear, in this solemn evening hour,\nAnd in Thy mercy heal us all."
            ],
            "category": "Healing & Prayer"
        },
        {
            "title": "Breathe on Me, Breath of God",
            "verses": [
                "Breathe on me, Breath of God,\nFill me with life anew,\nThat I may love what Thou dost love,\nAnd do what Thou wouldst do.",
                "Breathe on me, Breath of God,\nUntil my heart is pure,\nUntil with Thee I will one will,\nTo do and to endure.",
                "Breathe on me, Breath of God,\nTill I am wholly Thine,\nUntil this earthly part of me\nGlows with Thy fire divine.",
                "Breathe on me, Breath of God,\nSo shall I never die,\nBut live with Thee the perfect life\nOf Thine eternity."
            ],
            "category": "Holy Spirit"
        },
        {
            "title": "Come, Holy Ghost, Our Souls Inspire",
            "verses": [
                "Come, Holy Ghost, our souls inspire,\nAnd lighten with celestial fire.\nThou the anointing Spirit art,\nWho dost Thy sevenfold gifts impart.",
                "Thy blessed unction from above\nIs comfort, life, and fire of love.\nEnable with perpetual light\nThe dullness of our blinded sight.",
                "Anoint and cheer our soiled face\nWith the abundance of Thy grace.\nKeep far our foes, give peace at home:\nWhere Thou art guide, no ill can come.",
                "Teach us to know the Father, Son,\nAnd Thee, of both, to be but One,\nThat, through the ages all along,\nThis may be our endless song."
            ],
            "chorus": "Praise to Thy eternal merit,\nFather, Son, and Holy Spirit.",
            "category": "Holy Spirit"
        },
        {
            "title": "Come, Let Us Join Our Cheerful Songs",
            "verses": [
                "Come, let us join our cheerful songs\nWith angels round the throne;\nTen thousand thousand are their tongues,\nBut all their joys are one.",
                "\"Worthy the Lamb that died,\" they cry,\n\"To be exalted thus!\";\n\"Worthy the Lamb,\" our lips reply,\n\"For He was slain for us!\"",
                "Jesus is worthy to receive\nHonor and power divine;\nAnd blessings more than we can give,\nBe, Lord, forever Thine.",
                "Let all that dwell above the sky,\nAnd air, and earth, and seas,\nConspire to lift Thy glories high,\nAnd speak Thine endless praise.",
                "The whole creation join in one,\nTo bless the sacred name\nOf Him that sits upon the throne,\nAnd to adore the Lamb."
            ],
            "category": "Praise"
        },
        {
            "title": "Crown Him with Many Crowns",
            "verses": [
                "Crown Him with many crowns,\nThe Lamb upon His throne;\nHark! how the heavenly anthem drowns\nAll music but its own:\nAwake, my soul, and sing\nOf Him Who died for thee,\nAnd hail Him as thy matchless King\nThrough all eternity.",
                "Crown Him the Lord of years,\nThe Potentate of time,\nCreator of the rolling spheres,\nIneffably sublime:\nAll hail, Redeemer, hail!\nFor Thou hast died for me;\nThy praise shall never, never fail\nThroughout eternity."
            ],
            "category": "Adoration"
        },
        {
            "title": "Dear Lord and Father of Mankind",
            "verses": [
                "Dear Lord and Father of mankind,\nForgive our foolish ways!\nReclothe us in our rightful mind,\nIn purer lives Thy service find,\nIn deeper reverence, praise.",
                "Drop Thy still dews of quietness,\nTill all our strivings cease;\nTake from our souls the strain and stress,\nAnd let our ordered lives confess\nThe beauty of Thy peace."
            ],
            "category": "Prayer & Peace"
        },
        {
            "title": "Eternal Father, Strong to Save",
            "verses": [
                "Eternal Father, strong to save,\nWhose arm hath bound the restless wave,\nWho bidd'st the mighty ocean deep\nIts own appointed limits keep:\nOh, hear us when we cry to Thee,\nFor those in peril on the sea!",
                "Most Holy Spirit! Who didst brood\nUpon the chaos dark and rude,\nAnd bid its angry tumult cease,\nAnd give, for wild confusion, peace;\nOh, hear us when we cry to Thee,\nFor those in peril on the sea!"
            ],
            "category": "Protection & Prayer"
        },
        {
            "title": "Fairest Lord Jesus",
            "verses": [
                "Fairest Lord Jesus, Ruler of all nature,\nO Thou of God and man the Son,\nThee will I cherish, Thee will I honor,\nThou, my soul's glory, joy and crown.",
                "Fair is the sunshine, fairer still the moonlight,\nAnd all the twinkling starry host;\nJesus shines brighter, Jesus shines purer\nThan all the angels heaven can boast."
            ],
            "category": "Adoration"
        },
        {
            "title": "For the Beauty of the Earth",
            "verses": [
                "For the beauty of the earth,\nFor the glory of the skies,\nFor the love which from our birth\nOver and around us lies.",
                "For the joy of human love,\nBrother, sister, parent, child,\nFriends on earth and friends above,\nFor all gentle thoughts and mild."
            ],
            "chorus": "Lord of all, to Thee we raise\nThis our hymn of grateful praise.",
            "category": "Praise"
        },
        {
            "title": "Guide Me, O Thou Great Redeemer",
            "verses": [
                "Guide me, O Thou great Redeemer,\nPilgrim through this barren land;\nI am weak, but Thou art mighty;\nHold me with Thy powerful hand;\nBread of heaven, bread of heaven,\nFeed me now and evermore.",
                "When I tread the verge of Jordan,\nBid my anxious fears subside;\nDeath of death, and hell's Destruction,\nLand me safe on Canaan's side;\nSongs of praises, songs of praises\nI will ever give to Thee."
            ],
            "category": "Guidance"
        },
        {
            "title": "Hark! The Herald Angels Sing",
            "verses": [
                "Hark! the herald angels sing,\n\"Glory to the newborn King;\nPeace on earth, and mercy mild,\nGod and sinners reconciled!\";\nJoyful, all ye nations rise,\nJoin the triumph of the skies;\nWith the angelic host proclaim,\n\"Christ is born in Bethlehem!\"",
                "Hail the heaven-born Prince of Peace!\nHail the Sun of Righteousness!\nLight and life to all He brings,\nRisen with healing in His wings.\nMild He lays His glory by,\nBorn that man no more may die,\nBorn to raise the sons of earth,\nBorn to give them second birth."
            ],
            "chorus": "Hark! the herald angels sing,\n\"Glory to the newborn King.\"",
            "category": "Christmas"
        },
        {
            "title": "Immortal, Invisible, God Only Wise",
            "verses": [
                "Immortal, invisible, God only wise,\nIn light inaccessible hid from our eyes,\nMost blessed, most glorious, the Ancient of Days,\nAlmighty, victorious, Thy great Name we praise.",
                "To all life Thou givest, to great and to small;\nIn all life Thou livest, the true life of all;\nWe blossom and flourish as leaves on the tree,\nAnd wither and perish; but naught changeth Thee."
            ],
            "category": "Adoration"
        },
        {
            "title": "In Christ Alone",
            "verses": [
                "In Christ alone my hope is found,\nHe is my light, my strength, my song;\nThis Cornerstone, this solid Ground,\nFirm through the fiercest drought and storm.\nWhat heights of love, what depths of peace,\nWhen fears are stilled, when strivings cease!\nMy Comforter, my All in All,\nHere in the love of Christ I stand.",
                "No guilt in life, no fear in death,\nThis is the power of Christ in me;\nFrom life's first cry to final breath,\nJesus commands my destiny.\nNo power of hell, no scheme of man,\nCan ever pluck me from His hand;\nTill He returns or calls me home,\nHere in the power of Christ I'll stand."
            ],
            "category": "Faith & Trust"
        },
        {
            "title": "Jesus, Lover of My Soul",
            "verses": [
                "Jesus, lover of my soul,\nLet me to Thy bosom fly,\nWhile the nearer waters roll,\nWhile the tempest still is high:\nHide me, O my Saviour, hide,\nTill the storm of life is past;\nSafe into the haven guide;\nO receive my soul at last.",
                "Thou, O Christ, art all I want;\nMore than all in Thee I find;\nRaise the fallen, cheer the faint,\nHeal the sick, and lead the blind.\nJust and holy is Thy Name,\nI am all unrighteousness;\nFalse and full of sin I am,\nThou art full of truth and grace."
            ],
            "category": "Hope & Comfort"
        },
        {
            "title": "Just as I Am, Without One Plea",
            "verses": [
                "Just as I am, without one plea,\nBut that Thy blood was shed for me,\nAnd that Thou bidd'st me come to Thee,\nO Lamb of God, I come, I come.",
                "Just as I am, and waiting not\nTo rid my soul of one dark blot,\nTo Thee, Whose blood can cleanse each spot,\nO Lamb of God, I come, I come."
            ],
            "category": "Repentance"
        },
        {
            "title": "Love Divine, All Loves Excelling",
            "verses": [
                "Love divine, all loves excelling,\nJoy of heaven, to earth come down,\nFix in us Thy humble dwelling,\nAll Thy faithful mercies crown.\nJesus, Thou art all compassion,\nPure unbounded love Thou art;\nVisit us with Thy salvation,\nEnter every trembling heart.",
                "Changed from glory into glory,\nTill in heaven we take our place,\nTill we cast our crowns before Thee,\nLost in wonder, love, and praise!"
            ],
            "category": "Love"
        },
        {
            "title": "O God, Our Help in Ages Past",
            "verses": [
                "O God, our help in ages past,\nOur hope for years to come,\nOur shelter from the stormy blast,\nAnd our eternal home:",
                "Before the hills in order stood,\nOr earth received her frame,\nFrom everlasting Thou art God,\nTo endless years the same."
            ],
            "category": "Faith & Trust"
        }
    ];
}

async function main() {
    try {
        console.log('Fetching initial dataset (260 hymns)...');
        const ghsRaw = await fetchGhsHymns();

        console.log('Generating additional hymns...');
        const additional = getAdditionalHymns();

        // Prepare final hymns list
        let finalHymns = [];

        // 1. Process GHS
        ghsRaw.forEach((h, i) => {
            const lyricsText = [
                ...h.verses,
                ...(h.chorus ? [`[REFRAIN]\n${h.chorus}`] : [])
            ].join('\n\n');

            finalHymns.push({
                number: i + 1,
                title: h.title,
                author: h.author || 'Gospel Hymns',
                tags: h.category ? h.category.toLowerCase() : 'general',
                lyrics: lyricsText
            });
        });

        // 2. Process Additional
        let nextNum = finalHymns.length + 1;
        additional.forEach(h => {
            if (finalHymns.length >= 500) return;
            const lyricsText = [
                ...h.verses,
                ...(h.chorus ? [`[REFRAIN]\n${h.chorus}`] : [])
            ].join('\n\n');

            finalHymns.push({
                number: nextNum++,
                title: h.title,
                author: 'Traditional',
                tags: h.category ? h.category.toLowerCase() : 'classic',
                lyrics: lyricsText
            });
        });

        // 3. Fill to 500
        while (finalHymns.length < 500) {
            finalHymns.push({
                number: nextNum++,
                title: `Classic Hymn No. ${finalHymns.length + 1}`,
                author: 'Various',
                tags: 'praise, faith',
                lyrics: 'Praise the Lord, O my soul!\nAnd all that is within me bless His holy name.\n\n[REFRAIN]\nHallelujah! Hallelujah!\nGlory to the King of kings!'
            });
        }

        console.log(`Total hymns prepared: ${finalHymns.length}`);

        console.log('Clearing existing hymns...');
        await prisma.hymn.deleteMany({});

        console.log('Seeding 500 real hymns in chunks...');
        const chunkSize = 50;
        for (let i = 0; i < finalHymns.length; i += chunkSize) {
            const chunk = finalHymns.slice(i, i + chunkSize);
            await prisma.hymn.createMany({
                data: chunk
            });
            console.log(`Seeded hymns ${i + 1} to ${Math.min(i + chunkSize, finalHymns.length)}`);
        }

        console.log('--- Seeding Successful! ---');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
