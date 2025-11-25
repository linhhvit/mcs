'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, Camera, Site, Zone } from '@/lib/api'
import Layout from '@/components/Layout'
import PageHeader from '@/components/common/PageHeader'
import Tabs from '@/components/common/Tabs'
import CameraList from '@/components/cameras/CameraList'
import EmptyState from '@/components/common/EmptyState'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import CameraForm from '@/components/forms/CameraForm'
import SiteForm from '@/components/forms/SiteForm'
import ZoneForm from '@/components/forms/ZoneForm'

export default function CamerasPage() {
  const router = useRouter()
  const [cameras, setCameras] = useState<Camera[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'cameras' | 'sites' | 'zones'>('cameras')
  
  // Modal states
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [showZoneModal, setShowZoneModal] = useState(false)
  const [editingCamera, setEditingCamera] = useState<Camera | undefined>()
  const [editingSite, setEditingSite] = useState<Site | undefined>()
  const [editingZone, setEditingZone] = useState<Zone | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [camerasData, sitesData, zonesData] = await Promise.all([
        apiClient.getCameras(),
        apiClient.getSites(),
        apiClient.getZones(),
      ])
      setCameras(camerasData)
      setSites(sitesData)
      setZones(zonesData)
    } catch (error) {
      console.error('Failed to load data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [router])

  const handleCameraClick = (camera: Camera) => {
    router.push(`/cameras/${camera.camera_id}`)
  }

  // Camera CRUD handlers
  const handleCreateCamera = () => {
    setEditingCamera(undefined)
    setShowCameraModal(true)
  }

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera)
    setShowCameraModal(true)
  }

  const handleDeleteCamera = async (camera: Camera) => {
    if (!confirm(`Are you sure you want to delete camera "${camera.camera_name}"?`)) return
    
    try {
      await apiClient.deleteCamera(camera.camera_id)
      await loadData()
    } catch (error) {
      alert('Failed to delete camera: ' + (error as Error).message)
    }
  }

  const handleSubmitCamera = async (data: Partial<Camera>) => {
    try {
      setSubmitting(true)
      if (editingCamera) {
        await apiClient.updateCamera(editingCamera.camera_id, data)
      } else {
        await apiClient.createCamera(data)
      }
      setShowCameraModal(false)
      setEditingCamera(undefined)
      await loadData()
    } catch (error) {
      alert('Failed to save camera: ' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  // Site CRUD handlers
  const handleCreateSite = () => {
    setEditingSite(undefined)
    setShowSiteModal(true)
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
    setShowSiteModal(true)
  }

  const handleDeleteSite = async (site: Site) => {
    if (!confirm(`Are you sure you want to delete site "${site.site_name}"?`)) return
    
    try {
      await apiClient.deleteSite(site.site_id)
      await loadData()
    } catch (error) {
      alert('Failed to delete site: ' + (error as Error).message)
    }
  }

  const handleSubmitSite = async (data: Partial<Site>) => {
    try {
      setSubmitting(true)
      if (editingSite) {
        await apiClient.updateSite(editingSite.site_id, data)
      } else {
        await apiClient.createSite(data)
      }
      setShowSiteModal(false)
      setEditingSite(undefined)
      await loadData()
    } catch (error) {
      alert('Failed to save site: ' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  // Zone CRUD handlers
  const handleCreateZone = () => {
    setEditingZone(undefined)
    setShowZoneModal(true)
  }

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone)
    setShowZoneModal(true)
  }

  const handleDeleteZone = async (zone: Zone) => {
    if (!confirm(`Are you sure you want to delete zone "${zone.zone_name}"?`)) return
    
    try {
      await apiClient.deleteZone(zone.zone_id)
      await loadData()
    } catch (error) {
      alert('Failed to delete zone: ' + (error as Error).message)
    }
  }

  const handleSubmitZone = async (data: Partial<Zone>) => {
    try {
      setSubmitting(true)
      if (editingZone) {
        await apiClient.updateZone(editingZone.zone_id, data)
      } else {
        await apiClient.createZone(data)
      }
      setShowZoneModal(false)
      setEditingZone(undefined)
      await loadData()
    } catch (error) {
      alert('Failed to save zone: ' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'cameras', name: 'Cameras', count: cameras.length, icon: '📹' },
    { id: 'sites', name: 'Sites', count: sites.length, icon: '🏢' },
    { id: 'zones', name: 'Zones', count: zones.length, icon: '📍' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Camera Management"
            description="Manage cameras, sites, and zones"
            icon="📹"
          />
          <div className="flex gap-2">
            {activeTab === 'cameras' && (
              <Button onClick={handleCreateCamera}>+ Add Camera</Button>
            )}
            {activeTab === 'sites' && (
              <Button onClick={handleCreateSite}>+ Add Site</Button>
            )}
            {activeTab === 'zones' && (
              <Button onClick={handleCreateZone}>+ Add Zone</Button>
            )}
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as any)}
        />

        <div className="mt-6">
          {activeTab === 'cameras' && (
            <CameraList
              cameras={cameras}
              onCameraClick={handleCameraClick}
              onEdit={handleEditCamera}
              onDelete={handleDeleteCamera}
              loading={loading}
            />
          )}

          {activeTab === 'sites' && (
            <>
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : sites.length === 0 ? (
                <EmptyState
                  icon="🏢"
                  title="No sites found"
                  description="Add sites to organize your cameras."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sites.map((site) => (
                    <Card key={site.site_id} hover className="relative">
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditSite(site)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteSite(site)}
                        >
                          Delete
                        </Button>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-24">{site.site_name}</h3>
                      {site.location && (
                        <p className="text-sm text-gray-600">📍 {site.location}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">Site ID: {site.site_id}</p>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'zones' && (
            <>
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : zones.length === 0 ? (
                <EmptyState
                  icon="📍"
                  title="No zones found"
                  description="Create zones to group cameras within sites."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {zones.map((zone) => (
                    <Card key={zone.zone_id} hover className="relative">
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditZone(zone)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteZone(zone)}
                        >
                          Delete
                        </Button>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-24">{zone.zone_name}</h3>
                      <p className="text-sm text-gray-600">Site ID: {zone.site_id}</p>
                      {zone.description && (
                        <p className="text-sm text-gray-500 mt-2">{zone.description}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        <Modal
          isOpen={showCameraModal}
          onClose={() => {
            setShowCameraModal(false)
            setEditingCamera(undefined)
          }}
          title={editingCamera ? 'Edit Camera' : 'Create Camera'}
        >
          <CameraForm
            camera={editingCamera}
            zones={zones}
            onSubmit={handleSubmitCamera}
            onCancel={() => {
              setShowCameraModal(false)
              setEditingCamera(undefined)
            }}
            loading={submitting}
          />
        </Modal>

        <Modal
          isOpen={showSiteModal}
          onClose={() => {
            setShowSiteModal(false)
            setEditingSite(undefined)
          }}
          title={editingSite ? 'Edit Site' : 'Create Site'}
        >
          <SiteForm
            site={editingSite}
            onSubmit={handleSubmitSite}
            onCancel={() => {
              setShowSiteModal(false)
              setEditingSite(undefined)
            }}
            loading={submitting}
          />
        </Modal>

        <Modal
          isOpen={showZoneModal}
          onClose={() => {
            setShowZoneModal(false)
            setEditingZone(undefined)
          }}
          title={editingZone ? 'Edit Zone' : 'Create Zone'}
        >
          <ZoneForm
            zone={editingZone}
            sites={sites}
            onSubmit={handleSubmitZone}
            onCancel={() => {
              setShowZoneModal(false)
              setEditingZone(undefined)
            }}
            loading={submitting}
          />
        </Modal>
      </div>
    </Layout>
  )
}
