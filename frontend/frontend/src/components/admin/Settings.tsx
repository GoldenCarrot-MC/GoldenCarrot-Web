import { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { toast } from '@/components/ui/Toast';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SettingsData {
  siteTitle: string;
  siteDescription: string;
  allowRegister: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  maintenanceMode: boolean;
  maintenanceUntil?: string;
  maintenanceMessage: string;
}

export default function Settings() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  if (user?.role !== 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const [settings, setSettings] = useState<SettingsData>({
    siteTitle: '',
    siteDescription: '',
    allowRegister: true,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    maintenanceMode: false,
    maintenanceMessage: t('errors.maintenance.defaultMsg'),
    maintenanceUntil: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(data => {
      setSettings(data);
      setLoading(false);
    }).catch(() => {
      toast.error(t('admin.settings.fetchFailed'));
      setLoading(false);
    });
  }, [t]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success(t('admin.settings.updatedSuccess'));
    } catch (err) {
      toast.error(t('admin.settings.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-golden-500 animate-pulse">{t('admin.settings.loading')}</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-golden-500" />
        <h1 className="text-2xl font-bold text-white">{t('admin.settings.title')}</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-6 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-[#1e1e2e] pb-4">{t('admin.settings.maintenance.section')}</h2>
          
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-[#2e2e3e]">
              <div>
                <h3 className="text-white font-medium">{t('admin.settings.maintenance.enableTitle')}</h3>
                <p className="text-sm text-slate-400 mt-1">{t('admin.settings.maintenance.enableDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                />
                <div className="w-11 h-6 bg-[#2e2e3e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            {settings.maintenanceMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.maintenance.message')}</label>
                  <textarea 
                    value={settings.maintenanceMessage}
                    onChange={e => setSettings({...settings, maintenanceMessage: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-red-500 min-h-[100px]"
                    placeholder={t('admin.settings.maintenance.messagePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.maintenance.until')}</label>
                  <input 
                    type="datetime-local" 
                    value={settings.maintenanceUntil ? new Date(settings.maintenanceUntil).toISOString().slice(0, 16) : ''}
                    onChange={e => setSettings({...settings, maintenanceUntil: e.target.value})}
                    className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-6 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-[#1e1e2e] pb-4">{t('admin.settings.general.section')}</h2>
          
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.general.siteTitle')}</label>
              <input 
                type="text" 
                value={settings.siteTitle}
                onChange={e => setSettings({...settings, siteTitle: e.target.value})}
                className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.general.siteDescription')}</label>
              <textarea 
                value={settings.siteDescription}
                onChange={e => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500 min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-[#2e2e3e]">
              <div>
                <h3 className="text-white font-medium">{t('admin.settings.general.allowRegisterTitle')}</h3>
                <p className="text-sm text-slate-400 mt-1">{t('admin.settings.general.allowRegisterDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.allowRegister}
                  onChange={e => setSettings({...settings, allowRegister: e.target.checked})}
                />
                <div className="w-11 h-6 bg-[#2e2e3e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-golden-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-6 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-[#1e1e2e] pb-4">{t('admin.settings.smtp.section')}</h2>
          <p className="text-sm text-slate-400">{t('admin.settings.smtp.desc')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.smtp.host')}</label>
              <input 
                type="text" 
                value={settings.smtpHost}
                onChange={e => setSettings({...settings, smtpHost: e.target.value})}
                className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
                placeholder={t('admin.settings.smtp.hostPlaceholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.smtp.port')}</label>
              <input 
                type="number" 
                value={settings.smtpPort}
                onChange={e => setSettings({...settings, smtpPort: parseInt(e.target.value) || 587})}
                className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.smtp.username')}</label>
              <input 
                type="text" 
                value={settings.smtpUser}
                onChange={e => setSettings({...settings, smtpUser: e.target.value})}
                className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('admin.settings.smtp.password')}</label>
              <input 
                type="password" 
                value={settings.smtpPass}
                onChange={e => setSettings({...settings, smtpPass: e.target.value})}
                className="w-full px-4 py-2 bg-black/50 border border-[#2e2e3e] rounded-lg text-slate-200 focus:outline-none focus:border-golden-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-golden-500 text-black font-medium rounded-lg hover:bg-golden-400 transition-colors disabled:opacity-70"
          >
            {saving ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{saving ? t('admin.common.saving') : t('admin.settings.save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
