import React, { useState } from 'react';
import { Search, Book, FileText, Video, HelpCircle, Star, ThumbsUp, Plus, Eye, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

export function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    { id: '1', title: 'Product Documentation - Enterprise Plan', category: 'Product Docs', type: 'document', views: 245, rating: 4.8 },
    { id: '2', title: 'Sales Playbook 2024', category: 'Sales', type: 'document', views: 189, rating: 4.9 },
    { id: '3', title: 'Objection Handling Techniques', category: 'Training', type: 'video', views: 167, rating: 4.7 },
    { id: '4', title: 'Competitive Analysis - Market Leaders', category: 'Competitive', type: 'document', views: 203, rating: 4.6 },
    { id: '5', title: 'Demo Best Practices', category: 'Training', type: 'video', views: 198, rating: 4.9 },
    { id: '6', title: 'FAQ - Common Customer Questions', category: 'FAQ', type: 'faq', views: 312, rating: 4.5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Product documentation, sales playbooks, training materials & competitive analysis library
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">Knowledge items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{articles.reduce((sum, a) => sum + a.views, 0)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{(articles.reduce((sum, a) => sum + a.rating, 0) / articles.length).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Different topics</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex flex-col items-center py-3">
            <span className="font-medium">All</span>
            <span className="text-xs text-muted-foreground">All content</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex flex-col items-center py-3">
            <span className="font-medium">Documents</span>
            <span className="text-xs text-muted-foreground">PDFs & guides</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex flex-col items-center py-3">
            <span className="font-medium">Videos</span>
            <span className="text-xs text-muted-foreground">Training videos</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex flex-col items-center py-3">
            <span className="font-medium">FAQ</span>
            <span className="text-xs text-muted-foreground">Common questions</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex flex-col items-center py-3">
            <span className="font-medium">Upload</span>
            <span className="text-xs text-muted-foreground">Add content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search knowledge base..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    {article.type === 'document' && <FileText className="h-10 w-10 text-indigo-500" />}
                    {article.type === 'video' && <Video className="h-10 w-10 text-purple-500" />}
                    {article.type === 'faq' && <HelpCircle className="h-10 w-10 text-pink-500" />}
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1"><Eye className="h-3 w-3 mr-1" />View</Button>
                    <Button variant="outline" size="sm"><Download className="h-3 w-3" /></Button>
                    <Button variant="outline" size="sm"><ThumbsUp className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.filter(a => a.type === 'document').map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-10 w-10 text-indigo-500" />
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full"><Download className="h-3 w-3 mr-2" />Download PDF</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {articles.filter(a => a.type === 'video').map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Video className="h-10 w-10 text-purple-500" />
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full"><Video className="h-3 w-3 mr-2" />Watch Video</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {articles.filter(a => a.type === 'faq').map((article) => (
                  <div key={article.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-6 w-6 text-pink-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">Click to view answers and solutions</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Knowledge Content</CardTitle>
              <CardDescription>Add new documents, videos, or FAQ entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add New Content</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload files or create new knowledge articles</p>
                <Button><Plus className="h-4 w-4 mr-2" />Upload Content</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
