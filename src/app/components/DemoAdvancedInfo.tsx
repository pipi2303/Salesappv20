import React from 'react';
import { Users, DoorOpen, Laptop, MonitorPlay, Timer, RotateCcw, AlertCircle, Mail, UserCheck, UserX, Clock, Building2, User } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Demo } from '@/app/data/dummyData';

interface DemoAdvancedInfoProps {
  demo: Demo;
}

export function DemoAdvancedInfo({ demo }: DemoAdvancedInfoProps) {
  console.log('🔍 DemoAdvancedInfo received demo:', demo);
  console.log('👥 Attendees:', demo.attendees);
  console.log('📦 Resources:', demo.resources);
  console.log('⏱️ Buffer Time:', demo.bufferTime);
  
  return (
    <>
      {/* SECTION 5: Attendees (if exists) */}
      {demo.attendees && demo.attendees.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 overflow-hidden">
          <div className="px-5 py-3.5 bg-cyan-100/50 border-b border-cyan-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-cyan-600" />
              <span className="font-semibold text-gray-900">Attendees ({demo.attendees.length})</span>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="space-y-3">
              {demo.attendees.map((attendee) => (
                <div 
                  key={attendee.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      attendee.type === 'internal' 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}>
                      {attendee.type === 'internal' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Building2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{attendee.name}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-600">{attendee.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${
                      attendee.type === 'internal' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {attendee.type.toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs ${
                      attendee.rsvp === 'accepted' 
                        ? 'bg-emerald-500 text-white' 
                        : attendee.rsvp === 'declined'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {attendee.rsvp === 'accepted' && <UserCheck className="w-3 h-3 mr-1 inline" />}
                      {attendee.rsvp === 'declined' && <UserX className="w-3 h-3 mr-1 inline" />}
                      {attendee.rsvp === 'pending' && <Clock className="w-3 h-3 mr-1 inline" />}
                      {attendee.rsvp.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: Resources Booked (if exists) */}
      {demo.resources && demo.resources.length > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 overflow-hidden">
          <div className="px-5 py-3.5 bg-violet-100/50 border-b border-violet-200">
            <div className="flex items-center gap-3">
              <DoorOpen className="w-5 h-5 text-violet-600" />
              <span className="font-semibold text-gray-900">Resources Booked ({demo.resources.length})</span>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demo.resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    resource.type === 'room' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : resource.type === 'equipment'
                      ? 'bg-gradient-to-br from-orange-500 to-red-500'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                  }`}>
                    {resource.type === 'room' && <DoorOpen className="w-5 h-5 text-white" />}
                    {resource.type === 'equipment' && <Laptop className="w-5 h-5 text-white" />}
                    {resource.type === 'software' && <MonitorPlay className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{resource.name}</p>
                    <Badge className={`text-xs mt-1 ${
                      resource.type === 'room' 
                        ? 'bg-purple-100 text-purple-800' 
                        : resource.type === 'equipment'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {resource.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: Buffer Time & Timeline (if exists) */}
      {demo.bufferTime && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100 overflow-hidden">
          <div className="px-5 py-3.5 bg-rose-100/50 border-b border-rose-200">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Buffer Time Configuration</span>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-blue-600 mb-1">PREP TIME</p>
                <p className="text-2xl font-bold text-blue-900">{demo.bufferTime.before}</p>
                <p className="text-xs text-blue-700">minutes before</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-medium text-purple-600 mb-1">DEMO DURATION</p>
                <p className="text-2xl font-bold text-purple-900">{demo.duration}</p>
                <p className="text-xs text-purple-700">minutes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-medium text-green-600 mb-1">CLEANUP TIME</p>
                <p className="text-2xl font-bold text-green-900">{demo.bufferTime.after}</p>
                <p className="text-xs text-green-700">minutes after</p>
              </div>
            </div>
            
            {/* Visual Timeline */}
            <div className="mt-4 pt-4 border-t border-rose-100">
              <p className="text-xs font-medium text-gray-600 mb-3">Total Time Required</p>
              <div className="flex items-center gap-2">
                <div className="flex-none w-20 h-8 bg-blue-200 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-900">{demo.bufferTime.before}m</span>
                </div>
                <div className="flex-1 h-8 bg-purple-500 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">DEMO {demo.duration}m</span>
                </div>
                <div className="flex-none w-20 h-8 bg-green-200 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-green-900">{demo.bufferTime.after}m</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-bold text-gray-900">
                  Total: {demo.bufferTime.before + demo.duration + demo.bufferTime.after} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: Reschedule History (if exists) */}
      {demo.rescheduleHistory && demo.rescheduleHistory.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 overflow-hidden">
          <div className="px-5 py-3.5 bg-yellow-100/50 border-b border-yellow-200">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-900">Reschedule History ({demo.rescheduleHistory.length})</span>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="space-y-3">
              {demo.rescheduleHistory.map((history, index) => (
                <div key={index} className="relative pl-8 pb-4 border-l-2 border-yellow-300 last:border-l-0 last:pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs font-medium text-gray-500">{history.timestamp}</p>
                      <Badge className="bg-yellow-200 text-yellow-900 text-xs">Rescheduled</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Previous Schedule:</p>
                        <p className="font-medium text-red-600">
                          {history.previousDate} at {history.previousTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">New Schedule:</p>
                        <p className="font-medium text-green-600">
                          {history.newDate} at {history.newTime}
                        </p>
                      </div>
                    </div>
                    {history.reason && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Reason:</p>
                        <p className="text-sm text-gray-700">{history.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: Conflict Warnings (if exists) */}
      {demo.conflicts && demo.conflicts.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 overflow-hidden">
          <div className="px-5 py-3.5 bg-red-100/50 border-b border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-900">⚠️ Conflict Warnings ({demo.conflicts.length})</span>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="space-y-2">
              {demo.conflicts.map((conflict, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      {conflict.type === 'time' && '⏰ Time Conflict'}
                      {conflict.type === 'resource' && '🚪 Resource Conflict'}
                      {conflict.type === 'presenter' && '👤 Presenter Conflict'}
                    </p>
                    <p className="text-sm text-red-700">{conflict.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
