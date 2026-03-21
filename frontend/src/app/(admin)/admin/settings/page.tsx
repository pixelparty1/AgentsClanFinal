'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Shield,
  Database,
  Mail,
  Key,
  Globe,
  Wallet,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  LucideIcon,
} from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function SettingsSection({ title, description, icon: Icon, children }: SettingsSectionProps) {
  return (
    <GlowCard>
      <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </GlowCard>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-emerald-900/20 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-gray-700'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'left-[26px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    newUserAlerts: true,
    orderAlerts: true,
    questCompletionAlerts: false,
    
    // Site Settings
    maintenanceMode: false,
    registrationEnabled: true,
    nftMintingEnabled: true,
    storeEnabled: true,
    
    // Security
    twoFactorRequired: false,
    ipWhitelist: false,
    auditLogging: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <GradientHeading as="h1" className="text-3xl mb-2">
            Settings
          </GradientHeading>
          <p className="text-gray-400">
            Manage your admin dashboard and platform settings.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all"
        >
          {saving ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <Check className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SettingsSection
            title="Notifications"
            description="Configure how you receive alerts"
            icon={Bell}
          >
            <div className="space-y-1">
              <Toggle
                label="Email Notifications"
                description="Receive updates via email"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <Toggle
                label="Push Notifications"
                description="Browser push notifications"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              <Toggle
                label="New User Alerts"
                description="Get notified when users join"
                checked={settings.newUserAlerts}
                onChange={() => handleToggle('newUserAlerts')}
              />
              <Toggle
                label="Order Alerts"
                description="Notifications for new orders"
                checked={settings.orderAlerts}
                onChange={() => handleToggle('orderAlerts')}
              />
              <Toggle
                label="Quest Completion Alerts"
                description="When users complete quests"
                checked={settings.questCompletionAlerts}
                onChange={() => handleToggle('questCompletionAlerts')}
              />
            </div>
          </SettingsSection>
        </motion.div>

        {/* Site Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SettingsSection
            title="Site Settings"
            description="Control platform features"
            icon={Globe}
          >
            <div className="space-y-1">
              <Toggle
                label="Maintenance Mode"
                description="Show maintenance page to users"
                checked={settings.maintenanceMode}
                onChange={() => handleToggle('maintenanceMode')}
              />
              <Toggle
                label="User Registration"
                description="Allow new user sign-ups"
                checked={settings.registrationEnabled}
                onChange={() => handleToggle('registrationEnabled')}
              />
              <Toggle
                label="NFT Minting"
                description="Enable membership NFT minting"
                checked={settings.nftMintingEnabled}
                onChange={() => handleToggle('nftMintingEnabled')}
              />
              <Toggle
                label="Store"
                description="Enable merchandise store"
                checked={settings.storeEnabled}
                onChange={() => handleToggle('storeEnabled')}
              />
            </div>
          </SettingsSection>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SettingsSection
            title="Security"
            description="Security and access controls"
            icon={Shield}
          >
            <div className="space-y-1">
              <Toggle
                label="Two-Factor Required"
                description="Require 2FA for admin access"
                checked={settings.twoFactorRequired}
                onChange={() => handleToggle('twoFactorRequired')}
              />
              <Toggle
                label="IP Whitelist"
                description="Restrict admin to specific IPs"
                checked={settings.ipWhitelist}
                onChange={() => handleToggle('ipWhitelist')}
              />
              <Toggle
                label="Audit Logging"
                description="Log all admin actions"
                checked={settings.auditLogging}
                onChange={() => handleToggle('auditLogging')}
              />
            </div>
          </SettingsSection>
        </motion.div>

        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SettingsSection
            title="Connected Accounts"
            description="Manage integrations and services"
            icon={Key}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-black/20 border border-emerald-900/20">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium">Wallet</p>
                    <p className="text-xs text-gray-500 font-mono">0x7a2...f9</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Connected</span>
              </div>
              
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-black/20 border border-emerald-900/20">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium">Email Service</p>
                    <p className="text-xs text-gray-500">Resend API</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Active</span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-black/20 border border-emerald-900/20">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium">Database</p>
                    <p className="text-xs text-gray-500">Supabase</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Connected</span>
              </div>
            </div>
          </SettingsSection>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <GlowCard>
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Danger Zone</h3>
                <p className="text-sm text-gray-500">
                  Irreversible actions that require extra caution
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                Reset All Stats
              </button>
              <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                Clear Cache
              </button>
              <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                Export All Data
              </button>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}
