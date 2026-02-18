import { useState, useEffect } from 'react'
import './App.css'
import apiService from './services/api'

function MainSite() {
  const [currentSection, setCurrentSection] = useState('home')
  const [sliderIndex, setSliderIndex] = useState(0)
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', package: '' })
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(null)

  const [sliderImages, setSliderImages] = useState([])
  const [highSellingPackages, setHighSellingPackages] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [aboutContent, setAboutContent] = useState('')
  const [historyContent, setHistoryContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  // Load content from backend so admin updates are visible on user panel
  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [home, highSelling, all, about] = await Promise.all([
          apiService.getHomeImages(),
          apiService.getHighSellingPackages(),
          apiService.getPackages(),
          apiService.getAbout()
        ])

        const backendSliderImages = (home.data || []).map((img) => apiService.resolveMediaUrl(img.url))
        setSliderImages(
          backendSliderImages.length > 0
            ? backendSliderImages
            : [
                'https://picsum.photos/800/400?random=1',
                'https://picsum.photos/800/400?random=2',
                'https://picsum.photos/800/400?random=3'
              ]
        )

        setHighSellingPackages(
          (highSelling.data || []).map((pkg) => ({
            ...pkg,
            image: apiService.resolveMediaUrl(pkg.image)
          }))
        )
        setAllPackages(
          (all.data || []).map((pkg) => ({
            ...pkg,
            image: apiService.resolveMediaUrl(pkg.image)
          }))
        )

        setAboutContent(about.data?.content || '')
        setHistoryContent(about.data?.history || '')
        setVideoUrl(apiService.resolveMediaUrl(about.data?.video || ''))
      } catch (error) {
        console.error('Error loading site data:', error)
      }
    }

    loadPublicData()
  }, [])

  // Update current section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'packages', 'about', 'contact']
      const scrollY = window.scrollY + 100
      for (let section of sections) {
        const element = document.getElementById(section)
        if (element && scrollY >= element.offsetTop && scrollY < element.offsetTop + element.offsetHeight) {
          setCurrentSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-slide images every 4 seconds
  useEffect(() => {
    if (sliderImages.length === 0) return undefined
    const interval = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % sliderImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [sliderImages.length])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    // Submit enquiry to backend
    const result = await apiService.createEnquiry({
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      package: formData.package,
      message: `Book enquiry for ${formData.package}`
    })
    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setFormData({ name: '', email: '', contact: '', package: '' })
      return
    }
    setSubmitError(result.message || 'Failed to submit enquiry')
  }

  const scrollToSection = (section) => {
    setCurrentSection(section)
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' })
  }

  const formatIncludes = (includesValue) => {
    if (Array.isArray(includesValue)) {
      return includesValue.filter(Boolean).join(', ')
    }
    if (typeof includesValue === 'string') {
      return includesValue
    }
    return ''
  }

  return (
    <div className="app">
      {/* Logo */}
      <header className="header">
        <img 
          src="/assets/alien-logo.svg" 
          alt="Alien Logo" 
          className="alien-logo" 
          onClick={() => scrollToSection('home')} 
        />
      </header>

      {/* Navigation */}
      <nav className="nav">
        <ul className="nav-list">
          <li className={currentSection === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>Home</li>
          <li className={currentSection === 'packages' ? 'active' : ''} onClick={() => scrollToSection('packages')}>Tour Packages</li>
          <li className={currentSection === 'about' ? 'active' : ''} onClick={() => scrollToSection('about')}>About Us</li>
          <li className={currentSection === 'contact' ? 'active' : ''} onClick={() => scrollToSection('contact')}>Contact</li>
        </ul>
        <div className="nav-indicator" style={{ left: `${['home', 'packages', 'about', 'contact'].indexOf(currentSection) * 25}%` }}></div>
      </nav>

      {/* Home Section */}
      <section id="home" className="section home">
        <div className="slider">
          <img src={sliderImages[sliderIndex]} alt="Slider" />
          <button className="slider-arrow left-arrow" onClick={() => setSliderIndex((prevIndex) => (prevIndex - 1 + sliderImages.length) % sliderImages.length)}>&larr;</button>
          <button className="slider-arrow right-arrow" onClick={() => setSliderIndex((prevIndex) => (prevIndex + 1) % sliderImages.length)}>&rarr;</button>
        </div>
        <div className="high-selling">
          <div className="packages-grid">
            {highSellingPackages.map((pkg, index) => (
              <div key={index} className="package-card">
                <img src={pkg.image} alt={pkg.name} className="package-image" />
                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>
                <p>{pkg.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section id="packages" className="section packages">
        <h2>All Tour Packages</h2>
        <div className="packages-grid">
          {allPackages.map((pkg, index) => (
            <div key={index} className="package-card">
              <img src={pkg.image} alt={pkg.name} className="package-image" />
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <p>{pkg.price}</p>
              <p><strong>Duration:</strong> {pkg.duration || 'N/A'}</p>
              <p><strong>Includes:</strong> {formatIncludes(pkg.includes) || 'N/A'}</p>
              <div className="card-buttons">
                <button onClick={() => setFormData({ ...formData, package: pkg.name })}>Book Enquiry</button>
                <button className="view-details-btn" onClick={() => setSelectedPackage(pkg)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
        {selectedPackage && (
          <div className="package-details">
            <h3>{selectedPackage.name} Details</h3>
            <p><strong>Price:</strong> {selectedPackage.price}</p>
            <p><strong>Description:</strong> {selectedPackage.description}</p>
            <p><strong>Duration:</strong> {selectedPackage.duration || 'N/A'}</p>
            <p><strong>Includes:</strong> {formatIncludes(selectedPackage.includes) || 'N/A'}</p>
            <button onClick={() => setSelectedPackage(null)}>Close Details</button>
          </div>
        )}
        {formData.package && (
          <form className="enquiry-form" onSubmit={handleFormSubmit}>
            <h3>Book Enquiry for {formData.package}</h3>
            <input 
              type="text" 
              placeholder="Name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
            <input 
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input 
              type="tel" 
              placeholder="Contact Number" 
              value={formData.contact} 
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })} 
              required 
            />
            <button type="submit">Submit</button>
          </form>
        )}
        {showSuccess && <div className="success-message">Enquiry submitted successfully!</div>}
        {submitError && <div className="error-message">{submitError}</div>}
      </section>

      {/* About Us Section */}
      <section id="about" className="section about">
        <div className="about-container">
          <div className="about-content">
            <h2>About Us</h2>
            <p>{aboutContent}</p>
            <p>{historyContent}</p>
            <h3>Our History</h3>
            <p>{historyContent}</p>
          </div>
          <div className="about-video">
            <h3>Watch Our Story</h3>
            <iframe 
              width="100%" 
              height="315" 
              src={videoUrl} 
              title="Travel Company Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact">
        <h2>Contact Us</h2>
        <p>Email: info@travelcompany.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Travel Street, Adventure City</p>
      </section>
    </div>
  )
}

export default MainSite
