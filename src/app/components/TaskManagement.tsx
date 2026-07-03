import React, { useState } from 'react';
import { Search, Plus, CheckCircle, Circle, Clock, AlertCircle, Calendar, User, Tag, Filter, Trash2, Edit, Flag, Star, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatters';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  category: string;
  relatedTo?: string;
  tags: string[];
  subtasks?: SubTask[];
  completedDate?: string;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskManagement() {
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  // Dummy data - Tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up with PT Maju Jaya',
      description: 'Schedule demo presentation for Enterprise Plan',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-02-20',
      assignedTo: 'Budi Santoso',
      createdBy: 'Sarah Manager',
      createdDate: '2024-02-15',
      category: 'Sales Follow-up',
      relatedTo: 'OPP-001',
      tags: ['Demo', 'Enterprise', 'High-Value'],
      subtasks: [
        { id: '1a', title: 'Send calendar invite', completed: true },
        { id: '1b', title: 'Prepare demo materials', completed: false },
        { id: '1c', title: 'Review pricing options', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Prepare Q1 Sales Report',
      description: 'Compile and analyze sales data for quarterly review',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-02-25',
      assignedTo: 'Dewi Kartika',
      createdBy: 'John Director',
      createdDate: '2024-02-10',
      category: 'Reporting',
      tags: ['Report', 'Analytics', 'Quarterly'],
      subtasks: [
        { id: '2a', title: 'Gather sales data', completed: true },
        { id: '2b', title: 'Create visualizations', completed: true },
        { id: '2c', title: 'Write executive summary', completed: false },
        { id: '2d', title: 'Review with manager', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Update CRM data',
      description: 'Clean up and update all client contact information',
      status: 'completed',
      priority: 'low',
      dueDate: '2024-02-18',
      assignedTo: 'Ani Wijaya',
      createdBy: 'Ani Wijaya',
      createdDate: '2024-02-14',
      completedDate: '2024-02-17',
      category: 'Admin',
      tags: ['CRM', 'Data Quality'],
      subtasks: [
        { id: '3a', title: 'Verify email addresses', completed: true },
        { id: '3b', title: 'Update phone numbers', completed: true },
        { id: '3c', title: 'Check company info', completed: true }
      ]
    },
    {
      id: '4',
      title: 'Contract renewal - PT Global Solutions',
      description: 'Negotiate contract renewal terms for 3-year agreement',
      status: 'todo',
      priority: 'urgent',
      dueDate: '2024-02-22',
      assignedTo: 'Dewi Kartika',
      createdBy: 'Sarah Manager',
      createdDate: '2024-02-16',
      category: 'Contract',
      relatedTo: 'CONTRACT-003',
      tags: ['Renewal', 'Strategic Account', 'High-Value']
    },
    {
      id: '5',
      title: 'Product training for new features',
      description: 'Attend training session on new product features',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-02-21',
      assignedTo: 'Eko Prasetyo',
      createdBy: 'John Director',
      createdDate: '2024-02-12',
      category: 'Training',
      tags: ['Training', 'Product Knowledge']
    },
    {
      id: '6',
      title: 'Client satisfaction survey',
      description: 'Send satisfaction survey to all active clients',
      status: 'todo',
      priority: 'low',
      dueDate: '2024-02-28',
      assignedTo: 'Ani Wijaya',
      createdBy: 'Sarah Manager',
      createdDate: '2024-02-15',
      category: 'Customer Success',
      tags: ['Survey', 'Feedback']
    },
    {
      id: '7',
      title: 'Review discount approval requests',
      description: 'Process pending discount approval requests',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-02-19',
      assignedTo: 'Sarah Manager',
      createdBy: 'Sarah Manager',
      createdDate: '2024-02-17',
      category: 'Approvals',
      tags: ['Approval', 'Discount', 'Management']
    },
  ]);

  // Statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
    dueToday: tasks.filter(t => t.status !== 'completed' && t.dueDate === new Date().toISOString().split('T')[0]).length,
    highPriority: tasks.filter(t => t.status !== 'completed' && (t.priority === 'high' || t.priority === 'urgent')).length
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      low: { variant: 'secondary', label: 'Low', icon: Flag, className: '' },
      medium: { variant: 'default', label: 'Medium', icon: Flag, className: 'bg-blue-500' },
      high: { variant: 'default', label: 'High', icon: Flag, className: 'bg-orange-500' },
      urgent: { variant: 'destructive', label: 'Urgent', icon: AlertCircle, className: '' }
    };
    return variants[priority] || variants.low;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'todo': { variant: 'outline', label: 'To Do', icon: Circle },
      'in-progress': { variant: 'default', label: 'In Progress', icon: Clock, className: 'bg-blue-500' },
      'completed': { variant: 'default', label: 'Completed', icon: CheckCircle, className: 'bg-green-500' }
    };
    return variants[status] || variants.todo;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Sales Follow-up': 'bg-[#DFF0EC] text-[#013E37]',
      'Reporting': 'bg-[#DFF0EC] text-[#013E37]',
      'Admin': 'bg-gray-100 text-gray-700',
      'Contract': 'bg-green-100 text-green-700',
      'Training': 'bg-blue-100 text-blue-700',
      'Customer Success': 'bg-pink-100 text-pink-700',
      'Approvals': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        return {
          ...task,
          status: newStatus,
          completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return task;
    }));
    toast.success('Task status updated');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && new Date(task.dueDate) < new Date();
  };

  const isDueToday = (task: Task) => {
    return task.status !== 'completed' && task.dueDate === new Date().toISOString().split('T')[0];
  };

  const getCompletionPercentage = (task: Task): number => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase text-[#013E37]">
          Task & Activity Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personal & team task lists with follow-up reminders and activity scheduling
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Circle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todo}</div>
            <p className="text-xs text-muted-foreground">Pending tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Past deadline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.dueToday}</div>
            <p className="text-xs text-muted-foreground">Today's deadline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Flag className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Urgent items</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full h-auto p-1 bg-gray-100/50 backdrop-blur-sm rounded-xl border border-gray-200 grid grid-cols-4">
          <TabsTrigger 
            value="my-tasks" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#013E37] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">My Tasks</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-data-[state=active]:text-[#013E37]/70">Daftar Tugas Saya</span>
          </TabsTrigger>
          <TabsTrigger 
            value="team-tasks" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#013E37] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">Team Tasks</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aktivitas Tim</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#013E37] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">Calendar</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Timeline Jadwal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#013E37] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">Completed</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Riwayat Tugas</span>
          </TabsTrigger>
        </TabsList>

        {/* My Tasks Tab */}
        <TabsContent value="my-tasks" className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowTaskDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Your personal tasks and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg hover:bg-accent/50 transition-colors ${
                      isOverdue(task) ? 'border-red-300 bg-red-50/50' : ''
                    } ${isDueToday(task) ? 'border-orange-300 bg-orange-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            <div className="flex flex-wrap gap-2 items-center">
                              <Badge {...getStatusBadge(task.status)}>
                                {getStatusBadge(task.status).label}
                              </Badge>
                              <Badge {...getPriorityBadge(task.priority)}>
                                {getPriorityBadge(task.priority).label}
                              </Badge>
                              <Badge variant="outline" className={getCategoryColor(task.category)}>
                                <Tag className="h-3 w-3 mr-1" />
                                {task.category}
                              </Badge>
                              {task.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <Calendar className="h-3 w-3" />
                              <span className={isOverdue(task) ? 'text-red-600 font-semibold' : isDueToday(task) ? 'text-orange-600 font-semibold' : ''}>
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{task.assignedTo}</span>
                            </div>
                          </div>
                        </div>

                        {/* Subtasks Progress */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-3 p-3 bg-accent/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium">Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</span>
                              <span className="text-xs text-muted-foreground">{getCompletionPercentage(task)}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#013E37] to-[#025C52] transition-all"
                                style={{ width: `${getCompletionPercentage(task)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tasks Tab */}
        <TabsContent value="team-tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Tasks</CardTitle>
              <CardDescription>All tasks across the team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Budi Santoso', 'Ani Wijaya', 'Dewi Kartika', 'Eko Prasetyo'].map((member) => {
                  const memberTasks = tasks.filter(t => t.assignedTo === member && t.status !== 'completed');
                  return (
                    <div key={member} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#013E37] to-[#025C52] flex items-center justify-center text-white font-semibold">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{member}</h3>
                            <p className="text-sm text-muted-foreground">{memberTasks.length} active tasks</p>
                          </div>
                        </div>
                        <Badge variant="outline">{memberTasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length} high priority</Badge>
                      </div>
                      <div className="space-y-2">
                        {memberTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="text-sm p-2 bg-accent/30 rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{task.title}</span>
                              <Badge {...getPriorityBadge(task.priority)} className="text-xs">
                                {getPriorityBadge(task.priority).label}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
              <CardDescription>Tasks organized by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p className="text-sm text-muted-foreground">
                  Calendar integration coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>Task completion history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'completed').map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg bg-green-50/50">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold line-through text-muted-foreground mb-1">
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Completed: {formatDate(task.completedDate || task.createdDate)}</span>
                          <span>By: {task.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details: {selectedTask?.title}</DialogTitle>
            <DialogDescription>
              Complete details and progress tracking for task: {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedTask.title}</h2>
                <p className="text-muted-foreground">{selectedTask.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge {...getStatusBadge(selectedTask.status)}>
                      {getStatusBadge(selectedTask.status).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <div className="mt-1">
                    <Badge {...getPriorityBadge(selectedTask.priority)}>
                      {getPriorityBadge(selectedTask.priority).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p className="font-semibold">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p className="font-semibold">{formatDate(selectedTask.dueDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-semibold">{selectedTask.category}</p>
                </div>
                {selectedTask.relatedTo && (
                  <div>
                    <Label className="text-muted-foreground">Related To</Label>
                    <p className="font-semibold">{selectedTask.relatedTo}</p>
                  </div>
                )}
              </div>

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Subtasks</Label>
                  <div className="space-y-2">
                    {selectedTask.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2 p-2 border rounded">
                        <Checkbox checked={subtask.completed} />
                        <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.tags.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
            <Button>Edit Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your pipeline with priority, deadline, and assignee
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Task Title *</Label>
              <Input placeholder="Enter task title" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} placeholder="Describe the task..." />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Priority *</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Follow-up</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="customer">Customer Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assign To *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budi">Budi Santoso</SelectItem>
                    <SelectItem value="ani">Ani Wijaya</SelectItem>
                    <SelectItem value="dewi">Dewi Kartika</SelectItem>
                    <SelectItem value="eko">Eko Prasetyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date *</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label>Related To (Optional)</Label>
              <Input placeholder="e.g., OPP-001, CONTRACT-003" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Task created successfully!');
              setShowTaskDialog(false);
            }}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
