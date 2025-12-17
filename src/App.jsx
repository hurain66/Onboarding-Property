import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, ChevronDown, ChevronRight, Filter, Search, AlertCircle, Calendar, User, CheckSquare, Clock, Eye } from 'lucide-react';

const PropertyOnboardingApp = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedTasks, setExpandedTasks] = useState({});

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever properties change
  useEffect(() => {
    if (properties.length > 0) {
      saveData();
    }
  }, [properties]);

  const loadData = async () => {
    try {
      const result = await window.storage.get('properties-data');
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
  };

  const saveData = async () => {
    try {
      await window.storage.set('properties-data', JSON.stringify({ properties }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const checklistTemplate = [
    {
      id: 1,
      category: "Client Setup & Warnings",
      tasks: [
        { id: "1.1", name: "Set client expectations to go live", notes: "" },
        { id: "1.2", name: "Review client specific notes and warnings", notes: "Check sheet for client-specific requirements" },
        { id: "1.3", name: "Understand markup restriction during listing connection", notes: "Do NOT update markups when connecting - mainly for BDC" },
        { id: "1.4", name: "Prevent accidental bookings setup", notes: "Snooze property, block dates, or set price to 9999" }
      ]
    },
    {
      id: 2,
      category: "Platform Onboarding - Airbnb",
      tasks: [
        { id: "2.1", name: "Send/accept co-host invitation", notes: "Add client code to listing nickname. A008/A006/A044 do not add co-host" },
        { id: "2.2", name: "Add description and amenities", notes: "Use bare minimum if client doesn't provide" },
        { id: "2.3", name: "Add photos with descriptions", notes: "Ensure bedroom/bed count matches" },
        { id: "2.4", name: "Add fees and policies in Hospitable", notes: "Add on Airbnb first, then Hospitable. Must add log image" },
        { id: "2.5", name: "Verify listing onboarding completed", notes: "" }
      ]
    },
    {
      id: 3,
      category: "Platform Onboarding - VRBO",
      tasks: [
        { id: "3.1", name: "Add property to VRBO platform", notes: "Takes ~45 mins with good photos" },
        { id: "3.2", name: "Add iCal from Hospitable", notes: "Name it 'Hospitable iCal'" },
        { id: "3.3", name: "Add nickname and damage policy", notes: "Use Property Damage Protection (Recommended)" },
        { id: "3.4", name: "Add bank/payout information", notes: "" },
        { id: "3.5", name: "Add VRBO iCal to property", notes: "NOT in Hospitable - creates double reservation" },
        { id: "3.6", name: "Go live then unlist for checks", notes: "Property won't show in Hospitable until live" },
        { id: "3.7", name: "Merge with Hospitable", notes: "" },
        { id: "3.8", name: "Fix VRBO rules and policies", notes: "" },
        { id: "3.9", name: "Verify listing onboarding completed", notes: "For Jackson: need approval before going live" }
      ]
    },
    {
      id: 4,
      category: "Platform Onboarding - Booking.com",
      tasks: [
        { id: "4.1", name: "Login and verify primary account", notes: "Ensure on correct account when creating listings" },
        { id: "4.2", name: "Match rate plan with previous listings", notes: "Should be only one unless multiple guest rates needed" },
        { id: "4.3", name: "Add rate relations if needed", notes: "Check if client has non-refundable plans like A033" },
        { id: "4.4", name: "Add cancellation policy and fees", notes: "Cleaning, resort, insurance/damage deposit. Remove grace policy" },
        { id: "4.5", name: "Configure non-refundable rate plan", notes: "Set booking window 30+ days if applicable" },
        { id: "4.6", name: "Fix VAT and tax", notes: "If applicable" },
        { id: "4.7", name: "Verify Payments by Booking.com is ON", notes: "Ask client to add bank if needed" },
        { id: "4.8", name: "Add relay email", notes: "Must be in both Reservations and Primary Contact" },
        { id: "4.9", name: "Remove contact from listing page", notes: "" },
        { id: "4.10", name: "Whitelist automation links", notes: "Add castlehost.link and castlehost.com domains" },
        { id: "4.11", name: "Add Castlehost BDC account as user", notes: "Increase markup initially if hotel-like structure" },
        { id: "4.12", name: "Handle reconnection blocks", notes: "Manually block all reservations if reconnecting" },
        { id: "4.13", name: "Merge in Hospitable", notes: "" },
        { id: "4.14", name: "Set reminder to add scope", notes: "Easy to forget - do after BDC added to Hospitable" },
        { id: "4.15", name: "Complete BDC host profile", notes: "" },
        { id: "4.16", name: "Add extra guest fee", notes: "" },
        { id: "4.17", name: "Verify listing onboarding completed", notes: "PAYMENT METHOD MUST BE ADDED" }
      ]
    },
    {
      id: 5,
      category: "Pre-Launch Checks",
      tasks: [
        { id: "5.1", name: "Verify all fees are correct", notes: "Cleaning, tax, resort, security deposit from guest perspective" },
        { id: "5.2", name: "Verify bed photos and descriptions", notes: "All beds visible, match on all platforms" },
        { id: "5.3", name: "Confirm check-in/out times match", notes: "Same across all platforms" },
        { id: "5.4", name: "Add government registration codes", notes: "If applicable" },
        { id: "5.5", name: "Verify cancellation policies match", notes: "All platforms consistent" },
        { id: "5.6", name: "Confirm check-in details present", notes: "Clear instructions, backup code, WiFi details" },
        { id: "5.7", name: "Verify pricing is high to prevent booking", notes: "" }
      ]
    },
    {
      id: 6,
      category: "Hospitable Setup",
      tasks: [
        { id: "6.1", name: "Import Airbnb and VRBO properties", notes: "Should auto-import" },
        { id: "6.2", name: "Manually connect BDC properties", notes: "" },
        { id: "6.3", name: "Merge properties or setup parent-child", notes: "To avoid double booking" },
        { id: "6.4", name: "Rename property with street address", notes: "Format: A008 | Cabin Chic" },
        { id: "6.5", name: "Add internal names on platforms", notes: "Add client code. A044: don't add code" },
        { id: "6.6", name: "Add user permissions", notes: "Owner, manager, cleaners, clients" },
        { id: "6.7", name: "Setup Hostbuddy", notes: "Check subscription count" },
        { id: "6.8", name: "Match photo order across platforms", notes: "First 10 photos" },
        { id: "6.9", name: "Add reservations as manual reservations", notes: "Not as blocks" },
        { id: "6.10", name: "Upload upscaled photos to drive", notes: "If applicable" },
        { id: "6.11", name: "Add Hospitable tag", notes: "" }
      ]
    },
    {
      id: 7,
      category: "Automations & Operations",
      tasks: [
        { id: "7.1", name: "Add guidebook link if applicable", notes: "Check previous listings like A008" },
        { id: "7.2", name: "Create or verify automations", notes: "Bare minimum only. Include address, WiFi, parking" },
        { id: "7.3", name: "Add trash day information", notes: "" },
        { id: "7.4", name: "Create separate check-in instructions per listing", notes: "Don't combine unless requested" },
        { id: "7.5", name: "Scope Guest Experience automations", notes: "" },
        { id: "7.6", name: "Scope Operations module", notes: "" },
        { id: "7.7", name: "Use only castlehost.link for URL shortener", notes: "" },
        { id: "7.8", name: "Remove unnecessary spacing", notes: "Review thoroughly" },
        { id: "7.9", name: "Update URLs, codes, times in automations", notes: "" },
        { id: "7.10", name: "Scope review rules and custom codes", notes: "" },
        { id: "7.11", name: "Scope BDC in BOTH GX and OX", notes: "Must be done separately after BDC added" },
        { id: "7.12", name: "Update or add Hostbuddy", notes: "" },
        { id: "7.13", name: "Add upsells", notes: "" },
        { id: "7.14", name: "Add Hostbuddy review template", notes: "Use general template unless big customization" }
      ]
    },
    {
      id: 8,
      category: "PriceLabs Configuration",
      tasks: [
        { id: "8.1", name: "Configure basic pricing", notes: "" },
        { id: "8.2", name: "Add PriceLabs tag", notes: "" },
        { id: "8.3", name: "Share permissions", notes: "" },
        { id: "8.4", name: "Set up markup if applicable", notes: "Check A044, A008 (add 2BR data)" },
        { id: "8.5", name: "Turn PriceLabs ON", notes: "" },
        { id: "8.6", name: "Fix base rates and discounts post-publish", notes: "After pricing synced" },
        { id: "8.7", name: "Set reasonable base price on Airbnb", notes: "Affects FB/IG advertising" },
        { id: "8.8", name: "Set reminder for VRBO base price", notes: "Pricing sync not instant" }
      ]
    },
    {
      id: 9,
      category: "Direct Booking Website",
      tasks: [
        { id: "9.1", name: "Add property to direct website", notes: "If client has one" },
        { id: "9.2", name: "Confirm payout methods", notes: "" },
        { id: "9.3", name: "Confirm GVR", notes: "" },
        { id: "9.4", name: "Create/update cancellation policy", notes: "Match Airbnb policy" },
        { id: "9.5", name: "VERIFY PAYMENT METHOD ADDED", notes: "Critical before going live" }
      ]
    },
    {
      id: 10,
      category: "Calendar & Restrictions",
      tasks: [
        { id: "10.1", name: "Export Hospitable iCals to platforms", notes: "Airbnb to VRBO, etc." },
        { id: "10.2", name: "Apply calendar rule sets", notes: "Especially Airbnb for big event days" },
        { id: "10.3", name: "Verify availability matches across platforms", notes: "" },
        { id: "10.4", name: "Apply calendar restrictions for new listings", notes: "" }
      ]
    },
    {
      id: 11,
      category: "Cleaning & Integrations",
      tasks: [
        { id: "11.1", name: "Get cleaning requirements from client", notes: "" },
        { id: "11.2", name: "Create Turno listing", notes: "Match Hospitable property names" },
        { id: "11.3", name: "Add Hospitable iCal to Turno", notes: "Or direct integration" },
        { id: "11.4", name: "Setup Breezeway", notes: "" },
        { id: "11.5", name: "Add smart lock and backup codes", notes: "" },
        { id: "11.6", name: "Setup Superhog", notes: "Add writings to house rules" },
        { id: "11.7", name: "Setup RankBreeze", notes: "" }
      ]
    },
    {
      id: 12,
      category: "Final Steps & Audit",
      tasks: [
        { id: "12.1", name: "Request Airbnb category if applicable", notes: "" },
        { id: "12.2", name: "Verify Sync is ON in Hospitable", notes: "" },
        { id: "12.3", name: "Post fees screenshots to Slack", notes: "Self-audit task" },
        { id: "12.4", name: "Request team member audit", notes: "Have someone else review" },
        { id: "12.5", name: "Final go-live approval", notes: "All checks passed" }
      ]
    }
  ];

  const addProperty = (propertyData) => {
    const newProperty = {
      id: Date.now().toString(),
      ...propertyData,
      checklist: checklistTemplate.map(category => ({
        ...category,
        tasks: category.tasks.map(task => ({
          ...task,
          completed: false,
          completedBy: '',
          completedAt: '',
          updates: []
        }))
      })),
      status: 'Not Started',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedProperties = [...properties, newProperty];
    setProperties(updatedProperties);
    setShowAddModal(false);
    
    // Save immediately after adding
    setTimeout(() => {
      window.storage.set('properties-data', JSON.stringify({ properties: updatedProperties }))
        .catch(err => console.error('Error saving new property:', err));
    }, 100);
  };

  const updateTask = (propertyId, categoryId, taskId, completed, note = '', userName = '') => {
    setProperties(prevProperties => {
      const updatedProperties = prevProperties.map(prop => {
        if (prop.id !== propertyId) return prop;
        
        const updatedChecklist = prop.checklist.map(cat => {
          if (cat.id !== categoryId) return cat;
          
          return {
            ...cat,
            tasks: cat.tasks.map(task => {
              if (task.id !== taskId) return task;
              
              const update = note ? {
                note,
                userName: userName || 'Unknown User',
                timestamp: new Date().toISOString()
              } : null;
              
              return {
                ...task,
                completed,
                completedBy: completed ? (userName || 'Unknown User') : task.completedBy,
                completedAt: completed ? new Date().toISOString() : task.completedAt,
                updates: update ? [...(task.updates || []), update] : (task.updates || [])
              };
            })
          };
        });

        // Calculate progress
        const totalTasks = updatedChecklist.reduce((sum, cat) => sum + cat.tasks.length, 0);
        const completedTasks = updatedChecklist.reduce((sum, cat) => 
          sum + cat.tasks.filter(t => t.completed).length, 0);
        const progress = Math.round((completedTasks / totalTasks) * 100);

        // Determine status
        let status = 'Not Started';
        if (progress > 0 && progress < 100) status = 'In Progress';
        if (progress === 100) status = 'Completed';

        return {
          ...prop,
          checklist: updatedChecklist,
          progress,
          status,
          lastUpdated: new Date().toISOString()
        };
      });
      
      // Save to storage asynchronously
      window.storage.set('properties-data', JSON.stringify({ properties: updatedProperties }))
        .catch(err => console.error('Error saving:', err));
      
      return updatedProperties;
    });
  };

  const deleteProperty = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      setProperties(properties.filter(p => p.id !== propertyId));
      if (selectedProperty?.id === propertyId) {
        setSelectedProperty(null);
      }
    }
  };

  const filteredProperties = properties
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .slice(0, 20);

  const toggleTaskExpanded = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  if (selectedProperty) {
    return <PropertyDetail 
      property={selectedProperty} 
      onBack={() => setSelectedProperty(null)}
      onUpdateTask={updateTask}
      expandedTasks={expandedTasks}
      toggleTaskExpanded={toggleTaskExpanded}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Onboarding Manager</h1>
              <p className="text-gray-600 mt-1">Track onboarding progress across all properties</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Plus size={20} />
              Add Property
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Properties" 
            value={properties.length} 
            icon={<CheckSquare />}
            color="blue"
          />
          <StatCard 
            title="In Progress" 
            value={properties.filter(p => p.status === 'In Progress').length}
            icon={<Clock />}
            color="yellow"
          />
          <StatCard 
            title="Completed" 
            value={properties.filter(p => p.status === 'Completed').length}
            icon={<CheckCircle2 />}
            color="green"
          />
          <StatCard 
            title="Not Started" 
            value={properties.filter(p => p.status === 'Not Started').length}
            icon={<AlertCircle />}
            color="gray"
          />
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <CheckSquare size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">
              {properties.length === 0 
                ? "Get started by adding your first property"
                : "Try adjusting your search or filters"
              }
            </p>
            {properties.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add First Property
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => setSelectedProperty(property)}
                onDelete={() => deleteProperty(property.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <AddPropertyModal
          onClose={() => setShowAddModal(false)}
          onAdd={addProperty}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const PropertyCard = ({ property, onClick, onDelete }) => {
  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700'
  };

  const progress = property.progress || 0;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      <div onClick={onClick} className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.name}</h3>
            {property.address && (
              <p className="text-sm text-gray-600">{property.address}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
            {property.status}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {property.channelManager && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckSquare size={16} />
              <span>{property.channelManager}</span>
            </div>
          )}

          {property.dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Due: {new Date(property.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {property.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Updated {new Date(property.lastUpdated).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-3 flex justify-between items-center bg-gray-50">
        <button
          onClick={onClick}
          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
        >
          <Eye size={16} />
          View Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const PropertyDetail = ({ property, onBack, onUpdateTask, expandedTasks, toggleTaskExpanded }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [noteText, setNoteText] = useState({});
  const [userName, setUserName] = useState('');
  const [localProperty, setLocalProperty] = useState(property);

  // Update local property when prop changes
  React.useEffect(() => {
    setLocalProperty(property);
  }, [property]);

  const totalTasks = localProperty.checklist.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const completedTasks = localProperty.checklist.reduce((sum, cat) => 
    sum + cat.tasks.filter(t => t.completed).length, 0);

  const handleTaskToggle = (categoryId, taskId, currentStatus) => {
    const note = noteText[taskId] || '';
    const name = userName.trim() || 'Unknown User';
    
    // Update immediately in local state for responsive UI
    setLocalProperty(prev => {
      const updated = {
        ...prev,
        checklist: prev.checklist.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              tasks: cat.tasks.map(task => {
                if (task.id === taskId) {
                  const update = note ? {
                    note,
                    userName: name,
                    timestamp: new Date().toISOString()
                  } : null;
                  
                  return {
                    ...task,
                    completed: !currentStatus,
                    completedBy: !currentStatus ? name : task.completedBy,
                    completedAt: !currentStatus ? new Date().toISOString() : task.completedAt,
                    updates: update ? [...(task.updates || []), update] : task.updates
                  };
                }
                return task;
              })
            };
          }
          return cat;
        })
      };
      return updated;
    });
    
    // Then update parent
    onUpdateTask(property.id, categoryId, taskId, !currentStatus, note, name);
    setNoteText({ ...noteText, [taskId]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
              {property.address && <p className="text-gray-600 mt-1">{property.address}</p>}
              <div className="flex gap-4 mt-3 text-sm">
                {property.propertyId && (
                  <span className="text-gray-600">ID: {property.propertyId}</span>
                )}
                {property.channelManager && (
                  <span className="text-gray-600">• {property.channelManager}</span>
                )}
                {property.dueDate && (
                  <span className="text-gray-600">• Due: {new Date(property.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{property.progress || 0}%</div>
              <div className="text-sm text-gray-600 mt-1">{completedTasks} of {totalTasks} tasks</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${property.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name (for task tracking)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {localProperty.checklist.map((category) => {
            const categoryCompleted = category.tasks.filter(t => t.completed).length;
            const categoryTotal = category.tasks.length;
            const categoryProgress = Math.round((categoryCompleted / categoryTotal) * 100);

            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {activeCategory === category.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {categoryCompleted} of {categoryTotal} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${categoryProgress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                      {categoryProgress}%
                    </span>
                  </div>
                </button>

                {activeCategory === category.id && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <div className="space-y-3">
                      {category.tasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTaskToggle(category.id, task.id, task.completed);
                              }}
                              className="mt-1 flex-shrink-0 cursor-pointer"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="text-green-600" size={24} />
                              ) : (
                                <Circle className="text-gray-400 hover:text-indigo-600 transition-colors" size={24} />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {task.name}
                                  </h4>
                                  {task.notes && (
                                    <p className="text-sm text-gray-600 mt-1 italic">💡 {task.notes}</p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0">{task.id}</span>
                              </div>

                              {task.completed && (
                                <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                                  <User size={14} />
                                  <span>
                                    Completed by {task.completedBy} on {new Date(task.completedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}

                              {!task.completed && (
                                <div className="mt-3">
                                  <input
                                    type="text"
                                    placeholder="Add a note or update (optional)..."
                                    value={noteText[task.id] || ''}
                                    onChange={(e) => setNoteText({ ...noteText, [task.id]: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  />
                                </div>
                              )}

                              {task.updates && task.updates.length > 0 && (
                                <div className="mt-3">
                                  <button
                                    onClick={() => toggleTaskExpanded(task.id)}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                  >
                                    {expandedTasks[task.id] ? '▼' : '▶'} {task.updates.length} update{task.updates.length !== 1 ? 's' : ''}
                                  </button>
                                  {expandedTasks[task.id] && (
                                    <div className="mt-2 space-y-2">
                                      {task.updates.map((update, idx) => (
                                        <div key={idx} className="bg-gray-100 rounded p-3 text-sm">
                                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <User size={14} />
                                            <span className="font-medium">{update.userName}</span>
                                            <span>•</span>
                                            <span>{new Date(update.timestamp).toLocaleString()}</span>
                                          </div>
                                          <p className="text-gray-700">{update.note}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AddPropertyModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    propertyId: '',
    address: '',
    channelManager: '',
    dueDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    if (formData.name.trim()) {
      onAdd(formData);
    } else {
      alert('Property name is required');
    }
  };

  const handleCreateClick = () => {
    console.log('Create button clicked with data:', formData);
    if (formData.name.trim()) {
      onAdd(formData);
    } else {
      alert('Property name is required');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <p className="text-gray-600 mt-1">Fill in the property details to create a new onboarding checklist</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cabin Chic Downtown"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property ID / Code
            </label>
            <input
              type="text"
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              placeholder="e.g., A008"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 123 Main St, City, State"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel Manager
            </label>
            <select
              value={formData.channelManager}
              onChange={(e) => setFormData({ ...formData, channelManager: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Hospitable">Hospitable</option>
              <option value="Guesty">Guesty</option>
              <option value="OwnerRez">OwnerRez</option>
              <option value="Hostaway">Hostaway</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateClick}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Create Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyOnboardingApp;
