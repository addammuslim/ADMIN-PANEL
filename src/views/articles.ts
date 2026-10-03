/**
 * AuraMaster Blog & Articles CMS Views
 * With a working vanilla Rich Text Editor toolbar, category manager,
 * and search engine preview.
 */
import { store } from '../utils/store';
import { Article } from '../data/mockData';
import { slugify } from '../utils/formatters';
import { showToast } from '../utils/toast';
import { confirmAction, openModal, closeModal } from '../utils/modal';

export function renderArticlesView(): string {
  const state = store.getState();

  const rowsHtml = state.articles.map((art) => {
    const statusBadges: Record<string, string> = {
      Published: 'badge-success',
      Draft: 'badge-neutral',
      Scheduled: 'badge-info'
    };

    return `
      <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
        <td>
          <div class="font-bold text-xs text-slate-900 dark:text-white max-w-sm truncate">${art.title}</div>
          <div class="text-[11px] text-slate-400 font-mono">/${art.slug}</div>
        </td>
        <td class="text-xs text-slate-600 dark:text-slate-300">${art.category}</td>
        <td class="text-xs text-slate-700 dark:text-slate-300">${art.author}</td>
        <td class="tabular-nums text-xs font-mono">${new Intl.NumberFormat('id-ID').format(art.views)}</td>
        <td class="tabular-nums text-xs text-slate-500">${art.publishedDate}</td>
        <td>
          <span class="badge ${statusBadges[art.status]}">
            <span class="badge-dot"></span>
            ${art.status}
          </span>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button class="btn-edit-article p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" data-id="${art.id}" title="Edit article">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="btn-delete-article p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" data-id="${art.id}" title="Delete article">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Blog & Content Management</h1>
          <p class="text-xs text-slate-500">Publish thought leadership, skincare tutorials, brand announcements, and SEO content</p>
        </div>
        <button id="btn-create-article" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>Write New Article</span>
        </button>
      </div>

      <!-- Articles Data Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Article Title & Slug</th>
                <th>Category</th>
                <th>Author</th>
                <th>Views</th>
                <th>Published</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function openArticleEditorModal(articleId?: string) {
  const state = store.getState();
  const isEditing = Boolean(articleId);
  const article: Article = articleId
    ? state.articles.find((a) => a.id === articleId)!
    : {
        id: `art-${Date.now().toString().slice(-4)}`,
        title: '',
        slug: '',
        category: 'Skincare Science',
        author: state.currentClient.adminName,
        views: 0,
        status: 'Published',
        publishedDate: new Date().toISOString().split('T')[0],
        excerpt: '',
        content: '<p>Write your detailed article body here...</p>'
      };

  const bodyHtml = `
    <div class="space-y-4">
      <div>
        <label class="form-label">Article Headline *</label>
        <input id="art-form-title" type="text" class="form-input text-base font-semibold" value="${article.title}" placeholder="e.g. 5 Science-Backed Benefits of Niacinamide" required />
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="form-label">URL Slug</label>
          <input id="art-form-slug" type="text" class="form-input font-mono text-xs" value="${article.slug || slugify(article.title)}" />
        </div>
        <div>
          <label class="form-label">Category</label>
          <select id="art-form-category" class="form-select text-xs">
            <option value="Skincare Science" ${article.category === 'Skincare Science' ? 'selected' : ''}>Skincare Science</option>
            <option value="Dermatology" ${article.category === 'Dermatology' ? 'selected' : ''}>Dermatology</option>
            <option value="Routine & Lifestyle" ${article.category === 'Routine & Lifestyle' ? 'selected' : ''}>Routine & Lifestyle</option>
            <option value="Sun Care" ${article.category === 'Sun Care' ? 'selected' : ''}>Sun Care</option>
            <option value="Case Studies" ${article.category === 'Case Studies' ? 'selected' : ''}>Case Studies</option>
          </select>
        </div>
        <div>
          <label class="form-label">Publish Status</label>
          <select id="art-form-status" class="form-select text-xs">
            <option value="Published" ${article.status === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Draft" ${article.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Scheduled" ${article.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
          </select>
        </div>
      </div>

      <div>
        <label class="form-label">Short Editorial Excerpt (1-2 sentences)</label>
        <textarea id="art-form-excerpt" class="form-textarea h-16 text-xs" placeholder="Summary shown in feed cards...">${article.excerpt}</textarea>
      </div>

      <!-- Rich Text Editor Container with Toolbar -->
      <div>
        <label class="form-label">Article Body (Rich Text Editor)</label>
        <div class="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-surface">
          <!-- Toolbar -->
          <div class="bg-slate-50 dark:bg-slate-900/60 p-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1 text-xs">
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-bold" data-cmd="bold" title="Bold">B</button>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 italic" data-cmd="italic" title="Italic">I</button>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 underline" data-cmd="underline" title="Underline">U</button>
            <div class="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700" data-cmd="formatBlock" data-val="h2" title="Heading 2">H2</button>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700" data-cmd="formatBlock" data-val="h3" title="Heading 3">H3</button>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700" data-cmd="formatBlock" data-val="blockquote" title="Quote">“ ”</button>
            <div class="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700" data-cmd="insertUnorderedList" title="Bullet List">• List</button>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700" data-cmd="insertOrderedList" title="Numbered List">1. List</button>
            <button type="button" class="editor-cmd p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-mono" data-cmd="formatBlock" data-val="pre" title="Code Block">&lt;/&gt;</button>
          </div>
          <!-- Editable Body Area -->
          <div
            id="editor-body"
            contenteditable="true"
            class="p-4 min-h-[180px] max-h-[260px] overflow-y-auto outline-none text-xs leading-relaxed text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none"
          >
            ${article.content}
          </div>
        </div>
      </div>
    </div>
  `;

  openModal({
    title: isEditing ? `Edit Article: ${article.title}` : 'Draft New Article',
    size: 'lg',
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button id="btn-save-article" class="btn btn-primary">${isEditing ? 'Save Changes' : 'Publish Article'}</button>
    `,
    onMount: (modalEl) => {
      // Connect editor commands
      modalEl.querySelectorAll('.editor-cmd').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const cmd = (btn as HTMLElement).dataset.cmd!;
          const val = (btn as HTMLElement).dataset.val || '';
          document.execCommand(cmd, false, val);
          const editor = modalEl.querySelector('#editor-body') as HTMLElement;
          editor?.focus();
        });
      });

      // Auto generate slug from title
      const titleInput = modalEl.querySelector('#art-form-title') as HTMLInputElement;
      const slugInput = modalEl.querySelector('#art-form-slug') as HTMLInputElement;
      titleInput?.addEventListener('input', () => {
        if (!isEditing) {
          slugInput.value = slugify(titleInput.value);
        }
      });

      // Save handler
      modalEl.querySelector('#btn-save-article')?.addEventListener('click', () => {
        const titleVal = titleInput.value.trim();
        if (!titleVal) {
          showToast({ title: 'Validation Error', message: 'Article headline is required.', type: 'danger' });
          return;
        }

        const editorBody = modalEl.querySelector('#editor-body') as HTMLElement;
        const updatedArticle: Article = {
          ...article,
          title: titleVal,
          slug: slugInput.value || slugify(titleVal),
          category: (modalEl.querySelector('#art-form-category') as HTMLSelectElement).value,
          status: (modalEl.querySelector('#art-form-status') as HTMLSelectElement).value as any,
          excerpt: (modalEl.querySelector('#art-form-excerpt') as HTMLTextAreaElement).value,
          content: editorBody.innerHTML
        };

        if (isEditing) {
          const updatedArticles = state.articles.map((a) => (a.id === article.id ? updatedArticle : a));
          store.setState({ articles: updatedArticles });
          showToast({ title: 'Article Updated', message: 'Content changes published.', type: 'success' });
        } else {
          store.setState({ articles: [updatedArticle, ...state.articles] });
          showToast({ title: 'Article Created', message: 'New article has been saved.', type: 'success' });
        }

        closeModal();
        store.navigate('articles');
      });
    }
  });
}

export function initArticlesEventListeners() {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  container.querySelector('#btn-create-article')?.addEventListener('click', () => {
    openArticleEditorModal();
  });

  container.querySelectorAll('.btn-edit-article').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      openArticleEditorModal(id);
    });
  });

  container.querySelectorAll('.btn-delete-article').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      confirmAction({
        title: 'Delete Article',
        message: 'Are you sure you want to permanently delete this article?',
        confirmText: 'Delete',
        isDanger: true,
        onConfirm: () => {
          store.setState({ articles: store.getState().articles.filter((a) => a.id !== id) });
          showToast({ title: 'Article Deleted', message: 'The article was removed.', type: 'success' });
          store.navigate('articles');
        }
      });
    });
  });
}
