'use client'
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus,
  Clock, 
  Target, 
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  ChevronDown,
  ArrowUpRight,
  Zap,
  Activity,
  FileText,
  Filter,
  MoreHorizontal,
  Star,
  Heart,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import ProtectedLayout from '../components/ProtectedLayout';

const TaskManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ProtectedLayout>
           <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Welcome Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-[#101060] mb-2">
                          Bienvenue sur votre espace de travail
                        </h2>
                        <p className="text-gray-600">
                          Gérez vos tâches et projets avec efficacité
                        </p>
                      </div>
                      <Link href="/Tasks" passHref>
                        <button className="px-6 py-3 bg-gradient-to-r from-[#B08C0A] to-[#101060] text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                          <Plus className="w-5 h-5" />
                          <link rel="stylesheet" href="/Tasks" />
                          <span>Créer une tâche</span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Tâches actives</h3>
                        <p className="text-3xl font-bold text-gray-900">--</p>
                        <p className="text-sm text-green-600">Prêt à commencer</p>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Terminées</h3>
                        <p className="text-3xl font-bold text-gray-900">--</p>
                        <p className="text-sm text-green-600">Excellente productivité</p>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#B08C0A] to-[#8A6B08] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#B08C0A] transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Collaborateurs</h3>
                        <p className="text-3xl font-bold text-gray-900">--</p>
                        <p className="text-sm text-green-600">Équipe connectée</p>
                      </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Productivité</h3>
                        <p className="text-3xl font-bold text-gray-900">--%</p>
                        <p className="text-sm text-green-600">En progression</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Quick Actions */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-[#101060] mb-4">Actions rapides</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                          <Link href='/Tasks'>
                             <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
                              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-sm font-medium text-gray-700">Nouvelle tâche</div>
                            </button>  
                          </Link>
                        
                          <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 group">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">Créer projet</div>
                          </button>
                          
                          <button className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 group">
                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">Inviter équipe</div>
                          </button>
                          
                          <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <BarChart3 className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">Voir rapports</div>
                          </button>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-[#101060]">Activité récente</h3>
                          <button className="text-sm text-[#B08C0A] hover:text-[#101060] font-medium">
                            Voir tout
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-center py-12 text-gray-500">
                            <div className="text-center">
                              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-sm">Votre activité apparaîtra ici</p>
                              <p className="text-xs text-gray-400 mt-1">Commencez par créer une tâche</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                      {/* Calendar Widget */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-[#101060]">Calendrier</h3>
                          <Calendar className="w-5 h-5 text-[#B08C0A]" />
                        </div>
                        <div className="text-center py-8">
                          <div className="text-2xl font-bold text-[#101060] mb-2">
                            {new Date().toLocaleDateString('fr-FR', { 
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </div>
                          <p className="text-sm text-gray-600">Aucun événement prévu</p>
                        </div>
                      </div>

                      {/* Performance Widget */}
                      <div className="bg-gradient-to-br from-[#101060] to-[#B08C0A] rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Performance</h3>
                          <Zap className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Productivité</span>
                            <span className="text-2xl font-bold">--%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-yellow-300 h-2 rounded-full w-0 transition-all duration-300"></div>
                          </div>
                          <p className="text-xs opacity-75">Commencez à travailler pour voir vos statistiques</p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-[#101060] mb-4">Aperçu rapide</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Tâches du jour</span>
                            </div>
                            <span className="text-sm font-medium">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Terminées</span>
                            </div>
                            <span className="text-sm font-medium">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">En retard</span>
                            </div>
                            <span className="text-sm font-medium">0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
    </ProtectedLayout>
 
  );
};

export default TaskManagerDashboard;