import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Eye, 
  Download, 
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  DollarSign,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';
import { IncomeTransaction, Parent, Student, IncomeItem } from '@/types';
import { format } from 'date-fns';

interface IncomeHistoryMainProps {
  transactions: IncomeTransaction[];
  parents: Parent[];
  students: Student[];
  incomeItems: IncomeItem[];
}

type SortField = 'date' | 'parent' | 'total' | 'status' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export const IncomeHistoryMain: React.FC<IncomeHistoryMainProps> = ({
  transactions,
  parents,
  students,
  incomeItems
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<IncomeTransaction | null>(null);

  const getParentName = useMemo(() => {
    return (parentId: string) => {
      const parent = parents.find(p => p.id === parentId);
      return parent ? `${parent.firstName} ${parent.lastName}` : 'Unknown Parent';
    };
  }, [parents]);

  const getStudentNames = useMemo(() => {
    return (studentIds: string[]) => {
      return studentIds.map(id => {
        const student = students.find(s => s.id === id);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
      }).join(', ');
    };
  }, [students]);

  const getItemNames = useMemo(() => {
    return (items: IncomeItem[]) => {
      return items.map(item => item.name).join(', ');
    };
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction => {
      const parentName = getParentName(transaction.parentId).toLowerCase();
      const studentNames = getStudentNames(transaction.studentIds).toLowerCase();
      const itemNames = getItemNames(transaction.items).toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        parentName.includes(searchTerm.toLowerCase()) ||
        studentNames.includes(searchTerm.toLowerCase()) ||
        itemNames.includes(searchTerm.toLowerCase()) ||
        transaction.total.toString().includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

      const matchesDateRange = (() => {
        if (dateRange === 'all') return true;
        const now = new Date();
        const transactionDate = new Date(transaction.date);
        
        switch (dateRange) {
          case 'today': {
            return transactionDate.toDateString() === now.toDateString();
          }
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return transactionDate >= monthAgo;
          }
          case 'year': {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return transactionDate >= yearAgo;
          }
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort the filtered results
    const sortedFiltered = [...filtered].sort((a, b) => {
      let aVal: string | number | Date, bVal: string | number | Date;
      
      switch (sortField) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'parent':
          aVal = getParentName(a.parentId);
          bVal = getParentName(b.parentId);
          break;
        case 'total':
          aVal = a.total;
          bVal = b.total;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sortedFiltered;
  }, [transactions, searchTerm, statusFilter, dateRange, sortField, sortOrder, getParentName, getStudentNames, getItemNames]);

  const totalAmount = filteredAndSortedTransactions.reduce((sum, t) => sum + t.total, 0);
  const paidAmount = filteredAndSortedTransactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.total, 0);
  const pendingAmount = filteredAndSortedTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Income Transaction History
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">
          View and manage all income transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-lg font-bold">{filteredAndSortedTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="text-lg font-bold text-green-600">${paidAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-lg font-bold text-orange-600">${pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader className="bg-indigo-100/50">
          <CardTitle className="text-indigo-800">
            Transaction History ({filteredAndSortedTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                      {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('parent')}
                  >
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Parent</span>
                      {getSortIcon('parent')}
                    </div>
                  </TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Total</span>
                      {getSortIcon('total')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>Receipt</span>
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id} 
                    className={index % 2 === 0 ? "bg-indigo-25" : "bg-white hover:bg-indigo-50"}
                  >
                    <TableCell>
                      <div className="font-medium">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {getParentName(transaction.parentId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {getStudentNames(transaction.studentIds)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {getItemNames(transaction.items)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-lg">
                        ${transaction.total.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.status === 'paid' ? 'default' : 'secondary'}
                        className={transaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                      >
                        {transaction.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.receiptImage ? (
                        <div className="flex items-center space-x-2">
                          <img 
                            src={transaction.receiptImage} 
                            alt="Receipt thumbnail" 
                            className="h-8 w-8 object-cover rounded border cursor-pointer hover:opacity-80"
                            onClick={() => {
                              const dialog = document.querySelector(`[data-receipt-id="${transaction.id}"] button`);
                              if (dialog) (dialog as HTMLElement).click();
                            }}
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" data-receipt-id={transaction.id}>
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Receipt Image</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center">
                                <img 
                                  src={transaction.receiptImage} 
                                  alt="Receipt" 
                                  className="max-h-[70vh] max-w-full object-contain rounded-lg border"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No receipt</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                          </DialogHeader>
                          {selectedTransaction && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Transaction ID</label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Date</label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(selectedTransaction.date), 'PPP')}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Parent/Guardian</label>
                                <p className="text-sm text-muted-foreground">
                                  {getParentName(selectedTransaction.parentId)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Students</label>
                                <p className="text-sm text-muted-foreground">
                                  {getStudentNames(selectedTransaction.studentIds)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Items</label>
                                <div className="space-y-2 mt-2">
                                  {selectedTransaction.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                                      <span>{item.name}</span>
                                      <span className="font-medium">${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-primary/10 rounded">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-lg font-bold">${selectedTransaction.total.toFixed(2)}</span>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Badge 
                                  className={`ml-2 ${selectedTransaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                                >
                                  {selectedTransaction.status === 'paid' ? 'Paid' : 'Pending'}
                                </Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Created By</label>
                                <p className="text-sm text-muted-foreground">{selectedTransaction.loggedUser}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Created At</label>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(selectedTransaction.createdAt), 'PPP pp')}
                                </p>
                              </div>
                              {selectedTransaction.receiptImage && (
                                <div>
                                  <label className="text-sm font-medium">Receipt Image</label>
                                  <div className="mt-2 p-4 bg-muted rounded-lg">
                                    <img 
                                      src={selectedTransaction.receiptImage} 
                                      alt="Receipt" 
                                      className="max-h-64 max-w-full object-contain rounded border mx-auto block"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAndSortedTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};