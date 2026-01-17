import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSecurity, MdGroup, MdLock, MdHistory, MdPhoneAndroid } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UserAccessControlPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrador', description: 'Acesso total ao sistema' },
    { id: 2, name: 'Gerente', description: 'Acesso a gestão e relatórios' },
    { id: 3, name: 'Atendente', description: 'Acesso a agendamentos e clientes' },
    { id: 4, name: 'Técnico', description: 'Acesso a serviços e ordens de serviço' }
  ]);

  const [permissions, setPermissions] = useState({
    admin: {
      dashboard: true,
      users: true,
      services: true,
      appointments: true,
      reports: true,
      settings: true
    },
    manager: {
      dashboard: true,
      users: false,
      services: true,
      appointments: true,
      reports: true,
      settings: false
    },
    attendant: {
      dashboard: true,
      users: false,
      services: false,
      appointments: true,
      reports: false,
      settings: false
    },
    technician: {
      dashboard: true,
      users: false,
      services: true,
      appointments: false,
      reports: false,
      settings: false
    }
  });

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expirationDays: 90,
    maxAttempts: 5,
    lockoutDuration: 30
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState({
    enabled: true,
    methods: ['email', 'sms', 'authenticator'],
    defaultMethod: 'authenticator',
    backupCodes: true
  });

  const [sessionSettings, setSessionSettings] = useState({
    timeoutMinutes: 30,
    maxConcurrentSessions: 2,
    rememberMeDuration: 30
  });

  const [accessLogs, setAccessLogs] = useState([
    { id: 1, user: 'admin', action: 'login', timestamp: '2024-03-20 10:00:00', ip: '192.168.1.1' },
    { id: 2, user: 'manager', action: 'view_report', timestamp: '2024-03-20 09:30:00', ip: '192.168.1.2' },
    { id: 3, user: 'attendant', action: 'create_appointment', timestamp: '2024-03-20 09:15:00', ip: '192.168.1.3' }
  ]);

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving access control settings...');
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
            <h1 className="text-2xl font-semibold">Controle de Acesso</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie permissões e segurança do sistema
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid grid-cols-6 gap-2">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <MdGroup size={20} />
            Funções
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <MdSecurity size={20} />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <MdLock size={20} />
            Senha
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <MdPhoneAndroid size={20} />
            2FA
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <MdSecurity size={20} />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <MdHistory size={20} />
            Logs
          </TabsTrigger>
        </TabsList>

        {/* Roles Management */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Funções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Editar</Button>
                        <Button variant="destructive">Excluir</Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button>Adicionar Nova Função</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Management */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Permissões</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Função</TableHead>
                    <TableHead>Dashboard</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Serviços</TableHead>
                    <TableHead>Agendamentos</TableHead>
                    <TableHead>Relatórios</TableHead>
                    <TableHead>Configurações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(permissions).map(([role, perms]) => (
                    <TableRow key={role}>
                      <TableCell className="font-medium capitalize">{role}</TableCell>
                      <TableCell>
                        <Switch
                          checked={perms.dashboard}
                          onCheckedChange={(checked) => setPermissions({
                            ...permissions,
                            [role]: { ...perms, dashboard: checked }
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={perms.users}
                          onCheckedChange={(checked) => setPermissions({
                            ...permissions,
                            [role]: { ...perms, users: checked }
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={perms.services}
                          onCheckedChange={(checked) => setPermissions({
                            ...permissions,
                            [role]: { ...perms, services: checked }
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={perms.appointments}
                          onCheckedChange={(checked) => setPermissions({
                            ...permissions,
                            [role]: { ...perms, appointments: checked }
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={perms.reports}
                          onCheckedChange={(checked) => setPermissions({
                            ...permissions,
                            [role]: { ...perms, reports: checked }
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={perms.settings}
                          onCheckedChange={(checked) => setPermissions({
                            ...permissions,
                            [role]: { ...perms, settings: checked }
                          })}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Policy */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Política de Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Comprimento Mínimo</Label>
                  <Input 
                    type="number"
                    value={passwordPolicy.minLength}
                    onChange={(e) => setPasswordPolicy({
                      ...passwordPolicy,
                      minLength: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dias para Expiração</Label>
                  <Input 
                    type="number"
                    value={passwordPolicy.expirationDays}
                    onChange={(e) => setPasswordPolicy({
                      ...passwordPolicy,
                      expirationDays: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tentativas Máximas</Label>
                  <Input 
                    type="number"
                    value={passwordPolicy.maxAttempts}
                    onChange={(e) => setPasswordPolicy({
                      ...passwordPolicy,
                      maxAttempts: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração do Bloqueio (minutos)</Label>
                  <Input 
                    type="number"
                    value={passwordPolicy.lockoutDuration}
                    onChange={(e) => setPasswordPolicy({
                      ...passwordPolicy,
                      lockoutDuration: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requisitos de Senha</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Letras Maiúsculas</span>
                      <Switch
                        checked={passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => setPasswordPolicy({
                          ...passwordPolicy,
                          requireUppercase: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Letras Minúsculas</span>
                      <Switch
                        checked={passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => setPasswordPolicy({
                          ...passwordPolicy,
                          requireLowercase: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Números</span>
                      <Switch
                        checked={passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => setPasswordPolicy({
                          ...passwordPolicy,
                          requireNumbers: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Caracteres Especiais</span>
                      <Switch
                        checked={passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) => setPasswordPolicy({
                          ...passwordPolicy,
                          requireSpecialChars: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Two-Factor Authentication */}
        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle>Autenticação em Dois Fatores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">2FA Habilitado</h3>
                  <p className="text-sm text-gray-600">Requer autenticação adicional para login</p>
                </div>
                <Switch
                  checked={twoFactorAuth.enabled}
                  onCheckedChange={(checked) => setTwoFactorAuth({
                    ...twoFactorAuth,
                    enabled: checked
                  })}
                />
              </div>
              {twoFactorAuth.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Métodos Disponíveis</Label>
                    <div className="space-y-2">
                      {twoFactorAuth.methods.map((method) => (
                        <div key={method} className="flex items-center justify-between">
                          <span className="capitalize">{method}</span>
                          <Switch
                            checked={true}
                            onCheckedChange={(checked) => {
                              const newMethods = checked
                                ? [...twoFactorAuth.methods, method]
                                : twoFactorAuth.methods.filter(m => m !== method);
                              setTwoFactorAuth({
                                ...twoFactorAuth,
                                methods: newMethods
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Método Padrão</Label>
                    <Select
                      value={twoFactorAuth.defaultMethod}
                      onValueChange={(value) => setTwoFactorAuth({
                        ...twoFactorAuth,
                        defaultMethod: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                      <SelectContent>
                        {twoFactorAuth.methods.map((method) => (
                          <SelectItem key={method} value={method} className="capitalize">
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Códigos de Backup</h3>
                      <p className="text-sm text-gray-600">Permitir códigos de backup para recuperação</p>
                    </div>
                    <Switch
                      checked={twoFactorAuth.backupCodes}
                      onCheckedChange={(checked) => setTwoFactorAuth({
                        ...twoFactorAuth,
                        backupCodes: checked
                      })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Management */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Sessões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tempo de Inatividade (minutos)</Label>
                  <Input 
                    type="number"
                    value={sessionSettings.timeoutMinutes}
                    onChange={(e) => setSessionSettings({
                      ...sessionSettings,
                      timeoutMinutes: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sessões Simultâneas Máximas</Label>
                  <Input 
                    type="number"
                    value={sessionSettings.maxConcurrentSessions}
                    onChange={(e) => setSessionSettings({
                      ...sessionSettings,
                      maxConcurrentSessions: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração do "Lembrar-me" (dias)</Label>
                  <Input 
                    type="number"
                    value={sessionSettings.rememberMeDuration}
                    onChange={(e) => setSessionSettings({
                      ...sessionSettings,
                      rememberMeDuration: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAccessControlPage; 