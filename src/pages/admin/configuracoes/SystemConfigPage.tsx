import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdBusiness, MdAccessTime, MdSettings, MdNotifications, MdIntegrationInstructions } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SystemConfigPage = () => {
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState({
    name: 'Lavatec',
    cnpj: '12.345.678/0001-90',
    address: 'Rua Exemplo, 123',
    phone: '(11) 99999-9999',
    email: 'contato@lavatec.com',
    website: 'www.lavatec.com'
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { start: '08:00', end: '18:00', open: true },
    tuesday: { start: '08:00', end: '18:00', open: true },
    wednesday: { start: '08:00', end: '18:00', open: true },
    thursday: { start: '08:00', end: '18:00', open: true },
    friday: { start: '08:00', end: '18:00', open: true },
    saturday: { start: '09:00', end: '13:00', open: false },
    sunday: { start: '00:00', end: '00:00', open: false }
  });

  const [serviceConfig, setServiceConfig] = useState({
    defaultDuration: 60,
    maxConcurrentServices: 3,
    cancellationPolicy: '24h',
    prepaymentRequired: true,
    prepaymentPercentage: 30
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentReminders: true,
    systemAlerts: true,
    marketingEmails: false
  });

  const [systemPreferences, setSystemPreferences] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BRL',
    theme: 'light'
  });

  const [integrations, setIntegrations] = useState({
    paymentGateway: {
      enabled: true,
      provider: 'mercadopago',
      apiKey: '****************'
    },
    calendar: {
      enabled: true,
      provider: 'google',
      apiKey: '****************'
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      apiKey: '****************'
    }
  });

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings...');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToAdmin}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Configurações do Sistema</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie as configurações do sistema
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid grid-cols-6 gap-2">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <MdBusiness size={20} />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <MdAccessTime size={20} />
            Horários
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <MdSettings size={20} />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <MdNotifications size={20} />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <MdSettings size={20} />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <MdIntegrationInstructions size={20} />
            Integrações
          </TabsTrigger>
        </TabsList>

        {/* Company Profile Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Perfil da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input 
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input 
                    value={companyProfile.cnpj}
                    onChange={(e) => setCompanyProfile({...companyProfile, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input 
                    value={companyProfile.address}
                    onChange={(e) => setCompanyProfile({...companyProfile, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input 
                    value={companyProfile.phone}
                    onChange={(e) => setCompanyProfile({...companyProfile, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={companyProfile.email}
                    onChange={(e) => setCompanyProfile({...companyProfile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input 
                    value={companyProfile.website}
                    onChange={(e) => setCompanyProfile({...companyProfile, website: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours Configuration */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-32">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="time" 
                      value={hours.start}
                      onChange={(e) => setWorkingHours({
                        ...workingHours,
                        [day]: {...hours, start: e.target.value}
                      })}
                      disabled={!hours.open}
                    />
                    <span>até</span>
                    <Input 
                      type="time" 
                      value={hours.end}
                      onChange={(e) => setWorkingHours({
                        ...workingHours,
                        [day]: {...hours, end: e.target.value}
                      })}
                      disabled={!hours.open}
                    />
                  </div>
                  <Switch
                    checked={hours.open}
                    onCheckedChange={(checked) => setWorkingHours({
                      ...workingHours,
                      [day]: {...hours, open: checked}
                    })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Configuration */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duração Padrão (minutos)</Label>
                  <Input 
                    type="number"
                    value={serviceConfig.defaultDuration}
                    onChange={(e) => setServiceConfig({
                      ...serviceConfig,
                      defaultDuration: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de Serviços Simultâneos</Label>
                  <Input 
                    type="number"
                    value={serviceConfig.maxConcurrentServices}
                    onChange={(e) => setServiceConfig({
                      ...serviceConfig,
                      maxConcurrentServices: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Política de Cancelamento</Label>
                  <Select
                    value={serviceConfig.cancellationPolicy}
                    onChange={(e) => setServiceConfig({
                      ...serviceConfig,
                      cancellationPolicy: e.target.value
                    })}
                  >
                    <option value="1h">1 hora</option>
                    <option value="24h">24 horas</option>
                    <option value="48h">48 horas</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pagamento Antecipado</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={serviceConfig.prepaymentRequired}
                      onCheckedChange={(checked) => setServiceConfig({
                        ...serviceConfig,
                        prepaymentRequired: checked
                      })}
                    />
                    <span>Obrigatório</span>
                  </div>
                </div>
                {serviceConfig.prepaymentRequired && (
                  <div className="space-y-2">
                    <Label>Percentual do Pagamento Antecipado</Label>
                    <Input 
                      type="number"
                      value={serviceConfig.prepaymentPercentage}
                      onChange={(e) => setServiceConfig({
                        ...serviceConfig,
                        prepaymentPercentage: parseInt(e.target.value)
                      })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Notificações por Email</Label>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notificações por SMS</Label>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Lembretes de Agendamento</Label>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      appointmentReminders: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Lembretes de Pagamento</Label>
                  <Switch
                    checked={notificationSettings.paymentReminders}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      paymentReminders: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Alertas do Sistema</Label>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      systemAlerts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Emails de Marketing</Label>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={systemPreferences.language}
                    onChange={(e) => setSystemPreferences({
                      ...systemPreferences,
                      language: e.target.value
                    })}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select
                    value={systemPreferences.timezone}
                    onChange={(e) => setSystemPreferences({
                      ...systemPreferences,
                      timezone: e.target.value
                    })}
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/New_York">New York (GMT-4)</option>
                    <option value="Europe/London">London (GMT+1)</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de Data</Label>
                  <Select
                    value={systemPreferences.dateFormat}
                    onChange={(e) => setSystemPreferences({
                      ...systemPreferences,
                      dateFormat: e.target.value
                    })}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select
                    value={systemPreferences.currency}
                    onChange={(e) => setSystemPreferences({
                      ...systemPreferences,
                      currency: e.target.value
                    })}
                  >
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select
                    value={systemPreferences.theme}
                    onChange={(e) => setSystemPreferences({
                      ...systemPreferences,
                      theme: e.target.value
                    })}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Management */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Integrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Gateway Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Gateway de Pagamento</h3>
                    <p className="text-sm text-gray-600">Integração com processador de pagamentos</p>
                  </div>
                  <Switch
                    checked={integrations.paymentGateway.enabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      paymentGateway: {
                        ...integrations.paymentGateway,
                        enabled: checked
                      }
                    })}
                  />
                </div>
                {integrations.paymentGateway.enabled && (
                  <div className="space-y-4 pl-4">
                    <div className="space-y-2">
                      <Label>Provedor</Label>
                      <Select
                        value={integrations.paymentGateway.provider}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          paymentGateway: {
                            ...integrations.paymentGateway,
                            provider: e.target.value
                          }
                        })}
                      >
                        <option value="mercadopago">Mercado Pago</option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password"
                        value={integrations.paymentGateway.apiKey}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          paymentGateway: {
                            ...integrations.paymentGateway,
                            apiKey: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Calendar Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Calendário</h3>
                    <p className="text-sm text-gray-600">Sincronização com calendário externo</p>
                  </div>
                  <Switch
                    checked={integrations.calendar.enabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      calendar: {
                        ...integrations.calendar,
                        enabled: checked
                      }
                    })}
                  />
                </div>
                {integrations.calendar.enabled && (
                  <div className="space-y-4 pl-4">
                    <div className="space-y-2">
                      <Label>Provedor</Label>
                      <Select
                        value={integrations.calendar.provider}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          calendar: {
                            ...integrations.calendar,
                            provider: e.target.value
                          }
                        })}
                      >
                        <option value="google">Google Calendar</option>
                        <option value="outlook">Microsoft Outlook</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password"
                        value={integrations.calendar.apiKey}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          calendar: {
                            ...integrations.calendar,
                            apiKey: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SMS Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS</h3>
                    <p className="text-sm text-gray-600">Envio de mensagens SMS</p>
                  </div>
                  <Switch
                    checked={integrations.sms.enabled}
                    onCheckedChange={(checked) => setIntegrations({
                      ...integrations,
                      sms: {
                        ...integrations.sms,
                        enabled: checked
                      }
                    })}
                  />
                </div>
                {integrations.sms.enabled && (
                  <div className="space-y-4 pl-4">
                    <div className="space-y-2">
                      <Label>Provedor</Label>
                      <Select
                        value={integrations.sms.provider}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          sms: {
                            ...integrations.sms,
                            provider: e.target.value
                          }
                        })}
                      >
                        <option value="twilio">Twilio</option>
                        <option value="aws">AWS SNS</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password"
                        value={integrations.sms.apiKey}
                        onChange={(e) => setIntegrations({
                          ...integrations,
                          sms: {
                            ...integrations.sms,
                            apiKey: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfigPage; 