import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, ArrowLeft, Users, Shield } from 'lucide-react';
import { User, Role } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UsersDataProps {
  users: User[];
  roles: Role[];
  onUserAdd: (user: User) => void;
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onRoleAdd: (role: Role) => void;
  onRoleUpdate: (role: Role) => void;
  onRoleDelete: (roleId: string) => void;
  onNavigate: (page: string) => void;
}

export const UsersData: React.FC<UsersDataProps> = ({
  users,
  roles,
  onUserAdd,
  onUserUpdate,
  onUserDelete,
  onRoleAdd,
  onRoleUpdate,
  onRoleDelete,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    roleId: '',
    isActive: true
  });

  const [roleFormData, setRoleFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
    isActive: true
  });

  const [newPermission, setNewPermission] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userFormData.username || !userFormData.email || !userFormData.firstName || !userFormData.lastName || !userFormData.roleId) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (editingUser) {
      const updatedUser = { ...editingUser, ...userFormData } as User;
      onUserUpdate(updatedUser);
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setEditingUser(null);
    } else {
      const newUser: User = {
        id: uuidv4(),
        username: userFormData.username || '',
        email: userFormData.email || '',
        firstName: userFormData.firstName || '',
        lastName: userFormData.lastName || '',
        roleId: userFormData.roleId || '',
        isActive: userFormData.isActive ?? true,
        createdAt: new Date()
      };
      onUserAdd(newUser);
      toast({
        title: "Success",
        description: "User added successfully"
      });
      setIsAddUserDialogOpen(false);
    }

    resetUserForm();
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roleFormData.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingRole) {
      const updatedRole = { ...editingRole, ...roleFormData } as Role;
      onRoleUpdate(updatedRole);
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
      setEditingRole(null);
    } else {
      const newRole: Role = {
        id: uuidv4(),
        name: roleFormData.name || '',
        description: roleFormData.description,
        permissions: roleFormData.permissions || [],
        isActive: roleFormData.isActive ?? true,
        createdAt: new Date()
      };
      onRoleAdd(newRole);
      toast({
        title: "Success",
        description: "Role added successfully"
      });
      setIsAddRoleDialogOpen(false);
    }

    resetRoleForm();
  };

  const resetUserForm = () => {
    setUserFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      roleId: '',
      isActive: true
    });
    setEditingUser(null);
  };

  const resetRoleForm = () => {
    setRoleFormData({
      name: '',
      description: '',
      permissions: [],
      isActive: true
    });
    setEditingRole(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData(user);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormData(role);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onUserDelete(userId);
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      onRoleDelete(roleId);
      toast({
        title: "Success",
        description: "Role deleted successfully"
      });
    }
  };

  const addPermission = () => {
    if (newPermission.trim()) {
      const updatedPermissions = [...(roleFormData.permissions || []), newPermission.trim()];
      setRoleFormData({...roleFormData, permissions: updatedPermissions});
      setNewPermission('');
    }
  };

  const removePermission = (permission: string) => {
    const updatedPermissions = (roleFormData.permissions || []).filter(p => p !== permission);
    setRoleFormData({...roleFormData, permissions: updatedPermissions});
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('data')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Data
          </Button>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold">Users & Roles Management</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Manage system users and permissions
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
            <CardHeader className="bg-slate-100/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-slate-800">Users List ({filteredUsers.length})</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[200px]"
                    />
                  </div>
                  <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetUserForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username *</Label>
                          <Input
                            id="username"
                            value={userFormData.username || ''}
                            onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userFormData.email || ''}
                            onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={userFormData.firstName || ''}
                              onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={userFormData.lastName || ''}
                              onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="roleId">Role *</Label>
                          <Select value={userFormData.roleId} onValueChange={(value) => setUserFormData({...userFormData, roleId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.filter(role => role.isActive).map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={userFormData.isActive ?? true}
                            onCheckedChange={(checked) => setUserFormData({...userFormData, isActive: checked})}
                          />
                          <Label htmlFor="isActive">Active</Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add User</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.username}</div>
                        </TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getRoleName(user.roleId)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
            <CardHeader className="bg-rose-100/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-rose-800">Roles List ({filteredRoles.length})</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[200px]"
                    />
                  </div>
                  <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetRoleForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleRoleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="roleName">Role Name *</Label>
                          <Input
                            id="roleName"
                            value={roleFormData.name || ''}
                            onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={roleFormData.description || ''}
                            onChange={(e) => setRoleFormData({...roleFormData, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Permissions</Label>
                          <div className="flex space-x-2 mt-2">
                            <Input
                              placeholder="Add permission..."
                              value={newPermission}
                              onChange={(e) => setNewPermission(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPermission())}
                            />
                            <Button type="button" onClick={addPermission} variant="outline">
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(roleFormData.permissions || []).map((permission) => (
                              <Badge key={permission} variant="secondary" className="cursor-pointer" onClick={() => removePermission(permission)}>
                                {permission} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="roleIsActive"
                            checked={roleFormData.isActive ?? true}
                            onCheckedChange={(checked) => setRoleFormData({...roleFormData, isActive: checked})}
                          />
                          <Label htmlFor="roleIsActive">Active</Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Role</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="font-medium">{role.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {role.description || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 2).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.isActive ? "default" : "secondary"}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editUsername">Username *</Label>
              <Input
                id="editUsername"
                value={userFormData.username || ''}
                onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                value={userFormData.email || ''}
                onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First Name *</Label>
                <Input
                  id="editFirstName"
                  value={userFormData.firstName || ''}
                  onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name *</Label>
                <Input
                  id="editLastName"
                  value={userFormData.lastName || ''}
                  onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editRoleId">Role *</Label>
              <Select value={userFormData.roleId} onValueChange={(value) => setUserFormData({...userFormData, roleId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(role => role.isActive).map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={userFormData.isActive ?? true}
                onCheckedChange={(checked) => setUserFormData({...userFormData, isActive: checked})}
              />
              <Label htmlFor="editIsActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editRoleName">Role Name *</Label>
              <Input
                id="editRoleName"
                value={roleFormData.name || ''}
                onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="editRoleDescription">Description</Label>
              <Textarea
                id="editRoleDescription"
                value={roleFormData.description || ''}
                onChange={(e) => setRoleFormData({...roleFormData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Add permission..."
                  value={newPermission}
                  onChange={(e) => setNewPermission(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPermission())}
                />
                <Button type="button" onClick={addPermission} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(roleFormData.permissions || []).map((permission) => (
                  <Badge key={permission} variant="secondary" className="cursor-pointer" onClick={() => removePermission(permission)}>
                    {permission} ×
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editRoleIsActive"
                checked={roleFormData.isActive ?? true}
                onCheckedChange={(checked) => setRoleFormData({...roleFormData, isActive: checked})}
              />
              <Label htmlFor="editRoleIsActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Role</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};