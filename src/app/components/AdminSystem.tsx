import React, { useState, useEffect } from 'react';
import { Shield, Users as UsersIcon, Key, FileText, Plus, Search, Edit2, Trash2, Eye, UserPlus, Settings, Activity, Lock, RefreshCw, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { User } from '@/app/data/dummyData';
import { usersApi, auditTrailApi } from '@/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { SettingsPanel } from '@/app/components/SettingsPanel';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export function AdminSystem() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Use dummy data instead of API calls
      const dummyUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@salesmonitoring.com',
          role: 'Admin',
          status: 'active',
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date(),
        },
        {
          id: '2',
          name: 'Sales Manager',
          email: 'manager@salesmonitoring.com',
          role: 'Manager',
          status: 'active',
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '3',
          name: 'Sales Rep 1',
          email: 'sales1@salesmonitoring.com',
          role: 'User',
          status: 'active',
          createdAt: new Date('2024-02-01'),
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: '4',
          name: 'Sales Rep 2',
          email: 'sales2@salesmonitoring.com',
          role: 'User',
          status: 'active',
          createdAt: new Date('2024-02-10'),
          lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: '5',
          name: 'Inactive User',
          email: 'inactive@salesmonitoring.com',
          role: 'User',
          status: 'inactive',
          createdAt: new Date('2024-01-05'),
          lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      ];

      const dummyAuditLogs = [
        {
          id: '1',
          user: 'admin@salesmonitoring.com',
          action: 'User Login',
          resource: 'Authentication',
          timestamp: new Date(),
          status: 'success',
          ipAddress: '192.168.1.1',
        },
        {
          id: '2',
          user: 'manager@salesmonitoring.com',
          action: 'Created New Lead',
          resource: 'Lead Management',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'success',
          ipAddress: '192.168.1.2',
        },
        {
          id: '3',
          user: 'sales1@salesmonitoring.com',
          action: 'Updated Contract',
          resource: 'Contracts',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          status: 'success',
          ipAddress: '192.168.1.3',
        },
        {
          id: '4',
          user: 'admin@salesmonitoring.com',
          action: 'Modified User Permissions',
          resource: 'User Management',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'success',
          ipAddress: '192.168.1.1',
        },
        {
          id: '5',
          user: 'sales2@salesmonitoring.com',
          action: 'Failed Login Attempt',
          resource: 'Authentication',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          status: 'failed',
          ipAddress: '192.168.1.4',
        },
      ];

      setUsers(dummyUsers);
      setAuditLogs(dummyAuditLogs);
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01544e]"></div>
      </div>
    );
  }

  const roles: Role[] = [
    {
      id: 'R001',
      name: 'Super Admin',
      description: 'Full access to all system features',
      permissions: ['all'],
      userCount: 1
    },
    {
      id: 'R002',
      name: 'Sales Manager',
      description: 'Manage sales team and view all reports',
      permissions: ['view_dashboard', 'manage_leads', 'manage_team', 'view_reports', 'manage_demos', 'manage_contracts'],
      userCount: 1
    },
    {
      id: 'R003',
      name: 'Sales Executive',
      description: 'Manage own leads and create demos',
      permissions: ['view_dashboard', 'manage_own_leads', 'create_demos', 'view_own_reports'],
      userCount: 2
    },
    {
      id: 'R004',
      name: 'Finance',
      description: 'View and manage contracts and reports',
      permissions: ['view_dashboard', 'view_contracts', 'view_reports', 'export_reports'],
      userCount: 1
    },
    {
      id: 'R005',
      name: 'Marketing',
      description: 'View leads and marketing reports',
      permissions: ['view_dashboard', 'view_leads', 'view_marketing_reports'],
      userCount: 1
    }
  ];

  const allPermissions = [
    { id: 'view_dashboard', name: 'View Dashboard', category: 'General' },
    { id: 'manage_leads', name: 'Manage All Leads', category: 'Leads' },
    { id: 'manage_own_leads', name: 'Manage Own Leads', category: 'Leads' },
    { id: 'view_leads', name: 'View Leads', category: 'Leads' },
    { id: 'manage_team', name: 'Manage Sales Team', category: 'Team' },
    { id: 'view_team', name: 'View Team', category: 'Team' },
    { id: 'manage_demos', name: 'Manage Demos', category: 'Demo' },
    { id: 'create_demos', name: 'Create Demos', category: 'Demo' },
    { id: 'manage_contracts', name: 'Manage Contracts', category: 'Contract' },
    { id: 'view_contracts', name: 'View Contracts', category: 'Contract' },
    { id: 'view_reports', name: 'View All Reports', category: 'Reports' },
    { id: 'view_own_reports', name: 'View Own Reports', category: 'Reports' },
    { id: 'export_reports', name: 'Export Reports', category: 'Reports' },
    { id: 'manage_users', name: 'Manage Users', category: 'Admin' },
    { id: 'manage_roles', name: 'Manage Roles', category: 'Admin' },
    { id: 'view_audit_logs', name: 'View Audit Logs', category: 'Admin' }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setUserFormData({});
    setSelectedUser(null);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserFormData(user);
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        const updateResult = await usersApi.update(user?.accessToken, selectedUser.id, userFormData);
        if (updateResult.success) {
          setUsers(users.map(u => u.id === selectedUser.id ? { ...selectedUser, ...userFormData } : u));
          toast.success('User berhasil diupdate');
        } else {
          toast.error(updateResult.error || 'Failed to update user');
        }
      } else {
        const newUser: User = {
          id: `U${String(users.length + 1).padStart(3, '0')}`,
          name: userFormData.name || '',
          email: userFormData.email || '',
          role: userFormData.role || '',
          status: 'active',
          lastLogin: new Date(),
          createdAt: new Date()
        };
        const createResult = await usersApi.create(user?.accessToken, newUser);
        if (createResult.success) {
          setUsers([...users, createResult.data]);
          toast.success('User baru berhasil ditambahkan');
        } else {
          toast.error(createResult.error || 'Failed to create user');
        }
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setIsSubmitting(false);
      setIsUserDialogOpen(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const deleteResult = await usersApi.delete(user?.accessToken, id);
      if (deleteResult.success) {
        setUsers(users.filter(u => u.id !== id));
        toast.success('User berhasil dihapus');
      } else {
        toast.error(deleteResult.error || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      const userToUpdate = users.find(u => u.id === id);
      if (userToUpdate) {
        const updateResult = await usersApi.update(user?.accessToken, id, { status: userToUpdate.status === 'active' ? 'inactive' : 'active' });
        if (updateResult.success) {
          setUsers(users.map(u => 
            u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
          ));
          toast.success('Status user berhasil diubah');
        } else {
          toast.error(updateResult.error || 'Failed to update user status');
        }
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to toggle user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#01544e]">
            Admin System
          </h1>
          <p className="text-gray-600 mt-1">Kelola user, roles, permissions, dan monitoring sistem</p>
        </div>
        <Button onClick={handleAddUser} className="bg-[#01544e] hover:bg-[#023d39]">
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Key className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Audit Logs</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="users" className="flex items-center gap-2 text-sm">
            <UsersIcon className="h-4.5 w-4.5" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2 text-sm">
            <Key className="h-4.5 w-4.5" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2 text-sm">
            <FileText className="h-4.5 w-4.5" />
            Audit Trail & Activity Log
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 text-sm">
            <Palette className="h-4.5 w-4.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari user berdasarkan nama, email, atau role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-indigo-100 text-indigo-800">{user.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.status === 'active'}
                              onCheckedChange={() => handleToggleUserStatus(user.id)}
                            />
                            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {user.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.lastLogin.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.createdAt.toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditUser(user)}>
                              <Edit2 className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Roles List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    System Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {roles.map((role) => (
                    <Card key={role.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedRole(role)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{role.name}</h3>
                              <Badge className="bg-purple-100 text-purple-800">{role.userCount} users</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 3).map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm.replace('_', ' ')}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Permissions Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  {selectedRole ? `${selectedRole.name} Permissions` : 'All Permissions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    allPermissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, typeof allPermissions>)
                  ).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">{category}</h4>
                      <div className="space-y-2 pl-4">
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <span className="text-sm text-gray-700">{perm.name}</span>
                            <Switch
                              checked={selectedRole?.permissions.includes('all') || selectedRole?.permissions.includes(perm.id) || false}
                              disabled={!selectedRole || selectedRole.permissions.includes('all')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  System Activity Log
                </CardTitle>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white flex-shrink-0">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{log.action}</h4>
                              <p className="text-sm text-gray-600">by {log.user} • {log.module}</p>
                            </div>
                            <Badge className="bg-gray-100 text-gray-800">
                              {log.timestamp.toLocaleString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                day: '2-digit',
                                month: 'short'
                              })}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>IP: {log.ipAddress}</span>
                            <span>•</span>
                            <span>ID: {log.id}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <SettingsPanel />
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            <DialogDescription>
              {selectedUser ? 'Edit detail user' : 'Masukkan detail user baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nama Lengkap</Label>
              <Input
                id="userName"
                value={userFormData.name || ''}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                placeholder="Masukkan nama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={userFormData.email || ''}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                placeholder="email@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Select value={userFormData.role} onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveUser} className="bg-gradient-to-r from-indigo-500 to-purple-500" disabled={isSubmitting}>
              {selectedUser ? 'Update' : 'Tambah'} User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}