import { Pencil, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { CategoryIcon } from '../../components/CategoryIcon';
import { Modal } from '../../components/Modal';
import { getBaseUrl, getDefaultBaseUrl, setBaseUrlOverride, setStoredCredentials } from '../../api/client';
import { getThemePreference, setThemePreference, type ThemePreference } from '../../lib/theme';
import { APP_VERSION } from '../../lib/version';
import type { Category } from '../../domain/category';
import type { User } from '../../domain/user';
import { useCategories, useDeleteCategory, useRenameCategory } from '../categories/queries';
import { useRenameUser, useUsers } from '../users/queries';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Auto' },
];

export function SettingsPage() {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(getThemePreference());
  const [baseUrlText, setBaseUrlText] = useState(getBaseUrl());
  const [baseUrlError, setBaseUrlError] = useState<string | null>(null);
  const [baseUrlSaved, setBaseUrlSaved] = useState(false);

  const [renamingUser, setRenamingUser] = useState<User | null>(null);
  const [renamingCategory, setRenamingCategory] = useState<Category | null>(null);

  const { data: users } = useUsers();
  const { data: categories } = useCategories();
  const renameUser = useRenameUser();
  const renameCategory = useRenameCategory();
  const deleteCategory = useDeleteCategory();

  const handleThemeChange = (preference: ThemePreference) => {
    setThemePreference(preference);
    setThemePreferenceState(preference);
  };

  const handleSaveBaseUrl = () => {
    try {
      const url = new URL(baseUrlText);
      if (!url.protocol || !url.host) throw new Error('invalid');
      setBaseUrlOverride(baseUrlText);
      setBaseUrlError(null);
      setBaseUrlSaved(true);
      setTimeout(() => setBaseUrlSaved(false), 2000);
    } catch {
      setBaseUrlError("That doesn't look like a valid URL (e.g. http://192.168.1.23:8000).");
    }
  };

  const handleResetBaseUrl = () => {
    setBaseUrlOverride(null);
    setBaseUrlText(getDefaultBaseUrl());
    setBaseUrlError(null);
  };

  const handleDeleteCategory = (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"? This can't be undone.`)) return;
    deleteCategory.mutate(category.id, {
      onError: (error) => window.alert(error.message),
    });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <div className="grid grid-cols-3 gap-2 rounded-full bg-gray-100 p-1 dark:bg-gray-700">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleThemeChange(option.value)}
              className={`rounded-full py-1.5 text-sm font-medium transition-colors ${
                themePreference === option.value
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Backend Server</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your backend's LAN address changes sometimes (e.g. after a router reboot) — update it here without
          rebuilding.
        </p>
        <input
          type="text"
          value={baseUrlText}
          onChange={(event) => setBaseUrlText(event.target.value)}
          placeholder="http://192.168.1.x:8000"
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {baseUrlError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{baseUrlError}</p>}
        {baseUrlSaved && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Saved.</p>}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleSaveBaseUrl}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleResetBaseUrl}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            Reset to Default
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">People</h2>
        <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          {(users ?? []).map((user) => (
            <li key={user.id} className="flex items-center justify-between py-2.5">
              <span className="text-gray-900 dark:text-white">{user.name}</span>
              <button
                type="button"
                onClick={() => setRenamingUser(user)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label={`Rename ${user.name}`}
              >
                <Pencil size={16} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
        <p className="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
          A category with existing transactions can't be deleted.
        </p>
        <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          {(categories ?? []).map((category) => (
            <li key={category.id} className="flex items-center gap-3 py-2.5">
              <CategoryIcon categoryName={category.name} />
              <span className="flex-1 text-gray-900 dark:text-white">{category.name}</span>
              <button
                type="button"
                onClick={() => setRenamingCategory(category)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label={`Rename ${category.name}`}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory(category)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
        <button
          type="button"
          onClick={() => {
            setStoredCredentials(null);
            window.location.reload();
          }}
          className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Log out
        </button>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">About</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Version</span>
          <span className="text-gray-900 dark:text-white">{APP_VERSION}</span>
        </div>
      </section>

      {renamingUser && (
        <RenameModal
          title="Rename Person"
          initialValue={renamingUser.name}
          isSubmitting={renameUser.isPending}
          onCancel={() => setRenamingUser(null)}
          onSave={(name) => {
            renameUser.mutate(
              { id: renamingUser.id, name },
              {
                onSuccess: () => setRenamingUser(null),
                onError: (error) => window.alert(error.message),
              }
            );
          }}
        />
      )}

      {renamingCategory && (
        <RenameModal
          title="Rename Category"
          initialValue={renamingCategory.name}
          isSubmitting={renameCategory.isPending}
          onCancel={() => setRenamingCategory(null)}
          onSave={(name) => {
            renameCategory.mutate(
              { id: renamingCategory.id, name },
              {
                onSuccess: () => setRenamingCategory(null),
                onError: (error) => window.alert(error.message),
              }
            );
          }}
        />
      )}
    </div>
  );
}

function RenameModal({
  title,
  initialValue,
  isSubmitting,
  onSave,
  onCancel,
}: {
  title: string;
  initialValue: string;
  isSubmitting: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed === '') return;
    onSave(trimmed);
  };

  return (
    <Modal title={title} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={name.trim() === '' || isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
