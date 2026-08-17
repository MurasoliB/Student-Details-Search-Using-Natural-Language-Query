<script>
  let query = '';
  let students = [];
  let filter = {};
  let loading = false;

  async function search() {
    if (!query.trim()) { students = []; filter = {}; return; }
    loading = true;
    try {
      const res = await fetch('https://student-search-backend-ts5r.onrender.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      students = data.students;
      filter = data.filter;
    } catch {
      students = [];
    }
    loading = false;
  }

  function handleKey(e) {
    if (e.key === 'Enter') search();
  }
</script>

<main>
  <div class="hero">
    <div class="hero-inner">
      <div class="claude-logo">
        <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#D4A574"/>
          <text x="20" y="27" text-anchor="middle" font-size="20" fill="white" font-weight="bold">C</text>
        </svg>
      </div>
      <h1>Student <span class="accent">Search</span></h1>
      <p class="tagline">Powered by AI — search naturally, find instantly</p>
    </div>
  </div>

  <div class="search-wrap">
    <div class="search-box">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        bind:value={query}
        on:keydown={handleKey}
        placeholder="Ask anything... e.g. tall boys who play cricket from Chennai"
      />
      <button on:click={search}>
        {#if loading}
          <span class="spinner"></span>
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
          </svg>
          Search
        {/if}
      </button>
    </div>

    <div class="chips">
      <span class="chips-label">Try:</span>
      {#each ['tall boys', 'girls from Chennai', 'name starts with N', 'A grade cricket players', 'O+ blood group', 'thin girls who love coding'] as s}
        <button class="chip" on:click={() => { query = s; search(); }}>{s}</button>
      {/each}
    </div>
  </div>

  {#if Object.keys(filter).length > 0}
    <div class="result-meta">
      <div class="meta-left">
        <span class="ai-badge">🤖 AI</span>
        <code>{JSON.stringify(filter)}</code>
      </div>
      <span class="result-count">{students.length} students found</span>
    </div>
  {/if}

  {#if loading}
    <div class="loading-wrap">
      <div class="claude-pulse">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#D4A574"/>
          <text x="20" y="27" text-anchor="middle" font-size="20" fill="white" font-weight="bold">C</text>
        </svg>
      </div>
      <p>AI is thinking...</p>
    </div>

  {:else if students.length === 0 && query}
    <div class="empty-wrap">
      <div class="empty-icon">🔎</div>
      <p>No students found for "<strong>{query}</strong>"</p>
      <p class="empty-hint">Try different keywords or check suggestions above</p>
    </div>

  {:else}
    <div class="grid">
      {#each students as s}
        <div class="card">
          <div class="card-top">
            <div class="avatar {s.gender}">{s.name[0]}</div>
            <div class="card-info">
              <h2>{s.name}</h2>
              <span class="gender-tag {s.gender}">{s.gender}</span>
            </div>
            <div class="grade grade-{s.grade}">{s.grade}</div>
          </div>

          <div class="sep"></div>

          <div class="stats">
            <div class="stat">
              <span class="stat-num">{s.age}</span>
              <span class="stat-lbl">yrs</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-num">{s.height}</span>
              <span class="stat-lbl">cm</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-num">{s.weight}</span>
              <span class="stat-lbl">kg</span>
            </div>
          </div>

          <div class="sep"></div>

          <div class="tags">
            <span class="tag t-blood">🩸 {s.bloodGroup}</span>
            <span class="tag t-sport">⚽ {s.sport}</span>
            <span class="tag t-city">📍 {s.city}</span>
            <span class="tag t-hobby">🎯 {s.hobby}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    background: #FFFFFF;
    color: #1C1917;
    font-family: 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
  }
  .hero {
    background: #FFFBF7;
    border-bottom: 2px solid #C9A87C;
    padding: 2.5rem 1rem 2rem;
    text-align: center;
  }
  .hero-inner { max-width: 600px; margin: 0 auto; }
  .claude-logo {
    display: inline-flex;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 16px rgba(212,165,116,0.25));
  }
  h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; color: #1C1917; }
  .accent { color: #D4A574; }
  .tagline { color: #A8A29E; margin-top: 0.5rem; font-size: 0.95rem; }
  .search-wrap { max-width: 780px; margin: 2rem auto; padding: 0 1rem; }
  .search-box {
    display: flex;
    align-items: center;
    background: #FFFBF7;
    border: 2px solid #C4956A;
    border-radius: 14px;
    padding: 6px 6px 6px 14px;
    gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-box:focus-within {
    border-color: #B07840;
    box-shadow: 0 0 0 3px rgba(212,165,116,0.2);
  }
  .search-icon { color: #C4B5A0; flex-shrink: 0; }
  input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: #1C1917;
    font-size: 0.95rem;
    padding: 10px 0;
  }
  input::placeholder { color: #C4B5A0; }
  button {
    background: #D4A574;
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }
  button:hover { background: #C49464; transform: scale(1.02); }
  button:active { transform: scale(0.98); }
  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 1rem; align-items: center; }
  .chips-label { color: #A8A29E; font-size: 0.82rem; }
  .chip {
    background: #FFFBF7;
    border: 1.5px solid #C4956A;
    color: #A8A29E;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .chip:hover { border-color: #B07840; color: #D4A574; background: #FFF5EB; }
  .result-meta {
    max-width: 780px;
    margin: 0 auto 1.5rem;
    padding: 10px 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .meta-left { display: flex; align-items: center; gap: 8px; }
  .ai-badge {
    background: #FFF5EB;
    border: 1.5px solid #C4956A;
    color: #D4A574;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  code {
    background: #FFF5EB;
    border: 1.5px solid #C4956A;
    color: #B07840;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.78rem;
  }
  .result-count { color: #A8A29E; font-size: 0.82rem; }
  .loading-wrap { text-align: center; padding: 4rem; color: #A8A29E; }
  .claude-pulse { display: inline-block; margin-bottom: 1rem; animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{transform:scale(0.85);opacity:0.6} 50%{transform:scale(1);opacity:1} }
  .empty-wrap { text-align: center; padding: 4rem 1rem; color: #A8A29E; }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .empty-hint { font-size: 0.82rem; margin-top: 0.5rem; color: #C4B5A0; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem 3rem;
  }
  .card {
    background: #FFFBF7;
    border: 2px solid #C4956A;
    border-radius: 14px;
    padding: 1.2rem;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover { transform: translateY(-3px); border-color: #B07840; box-shadow: 0 8px 24px rgba(176,120,64,0.15); }
  .card-top { display: flex; align-items: center; gap: 10px; }
  .avatar {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 800;
    flex-shrink: 0;
  }
  .avatar.male { background: #EFF6FF; color: #3B82F6; }
  .avatar.female { background: #FDF2F8; color: #EC4899; }
  .card-info { flex: 1; }
  .card-info h2 { font-size: 0.95rem; font-weight: 700; color: #1C1917; }
  .gender-tag {
    font-size: 0.68rem;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 3px;
    display: inline-block;
  }
  .gender-tag.male { background: #EFF6FF; color: #3B82F6; }
  .gender-tag.female { background: #FDF2F8; color: #EC4899; }
  .grade {
    width: 34px; height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.95rem;
    flex-shrink: 0;
  }
  .grade-A { background: #F0FDF4; color: #16A34A; border: 2px solid #86EFAC; }
  .grade-B { background: #FEFCE8; color: #CA8A04; border: 2px solid #FDE047; }
  .grade-C { background: #FFF7ED; color: #EA580C; border: 2px solid #FDC97A; }
  .sep { height: 1.5px; background: #C4956A; margin: 1rem 0; opacity: 0.4; }
  .stats { display: flex; align-items: center; justify-content: space-around; text-align: center; }
  .stat { display: flex; flex-direction: column; }
  .stat-num { font-size: 1.15rem; font-weight: 700; color: #D4A574; }
  .stat-lbl { font-size: 0.68rem; color: #A8A29E; margin-top: 1px; }
  .stat-divider { width: 1.5px; height: 28px; background: #C4956A; opacity: 0.4; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { padding: 4px 9px; border-radius: 7px; font-size: 0.73rem; font-weight: 500; border: 1.5px solid transparent; }
  .t-blood { background: #FFF1F2; color: #E11D48; border-color: #FECDD3; }
  .t-sport { background: #EFF6FF; color: #2563EB; border-color: #BFDBFE; }
  .t-city  { background: #F0FDF4; color: #16A34A; border-color: #BBF7D0; }
  .t-hobby { background: #FFFBEB; color: #D97706; border-color: #FDE68A; }
</style>
