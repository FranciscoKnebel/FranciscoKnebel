const fetchConfig = {
    headers: [['Authorization', `Bearer ${process.env.GH_TOKEN}`]]
};

const { writeFileSync } = require('fs');

async function parseJSON(response) {
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    let stream = '';
    while (true) {
        const { value, done } = await reader.read();

        if (!done) {
            stream += value;
        } else {
            break;
        }
    }
    return JSON.parse(stream);
}

(async () => {
    let page = 0;
    let count;

    let repos = [];
    do {
        page += 1;
        const data = await fetch(`https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator&page=${page}`, fetchConfig).then(parseJSON);

        count = data.length;
        if (data.length > 0) {
            repos.push(...data);
        }
    } while (count === 100);

    console.log({ repos: repos.length, pages: page });

    const cleanedRepos = repos.map(u => ({ language_url: u['languages_url'], full_name: u['full_name'] }))

    const list = await Promise.all(cleanedRepos.map(r => fetch(r['language_url'], fetchConfig).then(parseJSON).then(languages => ({ repo: r['full_name'], languages }))))

    const languages = list.reduce((acc, listItem) => {
        for (const language in listItem.languages) {
            if (Object.hasOwnProperty.call(listItem.languages, language)) {
                const lineCount = listItem.languages[language];
                
                if (!acc[language]) {
                    acc[language] = [];
                } 
                acc[language].push(lineCount);
            }
        }
        return acc;
    }, {});

    let total = [];
    let lineCount = 0;
    for (const language in languages) {
        if (Object.hasOwnProperty.call(languages, language)) {
            const langCount = languages[language].reduce((acc, curr) => acc + curr, 0);
            lineCount += langCount;
            total.push([language, langCount]);
        }
    }

    writeFileSync(__dirname+'/data/github-extract-languages.json', JSON.stringify({
        top10: total.sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => [e[0], e[1], `${((e[1]/lineCount)*100).toPrecision(3)}%`]),
        total,
        languages
    }, null, 2));
})();

