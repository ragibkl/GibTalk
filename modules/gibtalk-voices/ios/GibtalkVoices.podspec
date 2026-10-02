Pod::Spec.new do |s|
  s.name           = 'GibtalkVoices'
  s.version        = '0.1.0'
  s.summary        = 'Which text-to-speech languages the device can speak'
  s.description    = 'Lists installed speech voices and checks languages for GibTalk'
  s.author         = ''
  s.homepage       = 'https://gibtalk.com'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.license        = 'MIT'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,swift}"
end
