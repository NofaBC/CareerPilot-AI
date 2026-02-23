'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '@/lib/firebase';
import { Download, Plus, Trash2, Save, Upload, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  updatedAt: string;
}

export default function ResumeBuilder() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    updatedAt: '',
  });

  useEffect(() => {
    const loadResume = async () => {
      if (!user) return;
      
      try {
        // Load existing resume if available
        const resumeDoc = await getDoc(doc(firestore, 'resumes', user.uid));
        if (resumeDoc.exists()) {
          setResumeData(resumeDoc.data() as ResumeData);
        } else {
          // No resume exists - pre-populate from user profile
          const profileQuery = query(collection(firestore, 'users'), where('uid', '==', user.uid));
          const profileSnap = await getDocs(profileQuery);
          
          if (!profileSnap.empty) {
            const profileData = profileSnap.docs[0].data();
            setResumeData(prev => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                fullName: user.displayName || '',
                email: user.email || '',
                location: profileData.location || '',
              },
              skills: profileData.skills || [],
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(doc(firestore, 'resumes', user.uid), {
        ...resumeData,
        updatedAt: new Date().toISOString(),
      });
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          school: '',
          degree: '',
          field: '',
          graduationDate: '',
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type - for now only support text files
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Please upload a .txt file. To convert PDF/DOCX to text:\n\n1. Open your resume in the original application\n2. Select all text and copy\n3. Paste into a new text file\n4. Save as .txt and upload here');
      return;
    }

    setUploading(true);
    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Parse resume using AI
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!response.ok) throw new Error('Failed to parse resume');

      const { data } = await response.json();
      
      // Add IDs to experience and education entries
      const experienceWithIds = (data.experience || []).map((exp: any) => ({
        ...exp,
        id: Date.now().toString() + Math.random(),
      }));
      
      const educationWithIds = (data.education || []).map((edu: any) => ({
        ...edu,
        id: Date.now().toString() + Math.random(),
      }));

      setResumeData({
        personalInfo: data.personalInfo || resumeData.personalInfo,
        summary: data.summary || resumeData.summary,
        experience: experienceWithIds,
        education: educationWithIds,
        skills: data.skills || resumeData.skills,
        updatedAt: new Date().toISOString(),
      });

      alert('Resume uploaded and parsed successfully! Please review and edit as needed.');
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to parse resume. Please try again or enter information manually.');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleDownloadPDF = async () => {
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    const { personalInfo, summary, experience, education, skills } = resumeData;
    
    let yPos = 20;
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - 40;
    
    // Helper function to add text with word wrap
    const addText = (text: string, size: number, isBold: boolean = false) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, leftMargin, yPos);
      yPos += lines.length * (size * 0.4) + 2;
    };
    
    const checkPageBreak = (neededSpace: number) => {
      if (yPos + neededSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20;
      }
    };
    
    // Header - Name and Contact
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(personalInfo.fullName || 'Your Name', leftMargin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin && personalInfo.linkedin.trim() ? personalInfo.linkedin : null,
      personalInfo.website && personalInfo.website.trim() ? personalInfo.website : null,
    ].filter(Boolean).join(' • ');
    doc.text(contactInfo, leftMargin, yPos);
    yPos += 8;
    
    // Horizontal line
    doc.setDrawColor(200);
    doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
    yPos += 8;
    
    // Professional Summary
    if (summary) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', leftMargin, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(summary, maxWidth);
      doc.text(summaryLines, leftMargin, yPos);
      yPos += summaryLines.length * 4 + 8;
    }
    
    // Work Experience
    if (experience.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('WORK EXPERIENCE', leftMargin, yPos);
      yPos += 8;
      
      experience.forEach((exp) => {
        checkPageBreak(40);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.position, leftMargin, yPos);
        yPos += 5;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.company, leftMargin, yPos);
        
        // Date range
        const dateRange = exp.current 
          ? `${exp.startDate} - Present`
          : `${exp.startDate} - ${exp.endDate}`;
        doc.setFont('helvetica', 'normal');
        doc.text(dateRange, pageWidth - leftMargin, yPos, { align: 'right' });
        yPos += 5;
        
        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, maxWidth);
          doc.text(descLines, leftMargin + 5, yPos);
          yPos += descLines.length * 4 + 6;
        }
      });
    }
    
    // Education
    if (education.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', leftMargin, yPos);
      yPos += 8;
      
      education.forEach((edu) => {
        checkPageBreak(25);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.school, leftMargin, yPos);
        yPos += 5;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const degreeText = `${edu.degree} in ${edu.field}`;
        doc.text(degreeText, leftMargin, yPos);
        
        if (edu.graduationDate) {
          doc.text(edu.graduationDate, pageWidth - leftMargin, yPos, { align: 'right' });
        }
        yPos += 6;
      });
    }
    
    // Skills
    if (skills.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', leftMargin, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.join(', ');
      const skillsLines = doc.splitTextToSize(skillsText, maxWidth);
      doc.text(skillsLines, leftMargin, yPos);
    }
    
    // Save the PDF
    const fileName = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf` || 'Resume.pdf';
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading resume...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600 mt-1">Build your professional resume or upload an existing one</p>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer" title="Upload your resume as .txt file">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload .TXT'}
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={resumeData.personalInfo.fullName}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                })
              }
              className="col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={resumeData.personalInfo.email}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={resumeData.personalInfo.phone}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Location (e.g., New York, NY)"
              value={resumeData.personalInfo.location}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="url"
              placeholder="LinkedIn URL (Optional)"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="url"
              placeholder="Website/Portfolio (Optional)"
              value={resumeData.personalInfo.website}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, website: e.target.value },
                })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Summary</h2>
          <textarea
            placeholder="Write a brief summary of your professional background and career goals..."
            value={resumeData.summary}
            onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
            <button
              onClick={addExperience}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-semibold text-gray-500">Experience #{index + 1}</span>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="month"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="month"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600">
                    I currently work here
                  </label>
                </div>
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={3}
                  className="col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          ))}
          {resumeData.experience.length === 0 && (
            <p className="text-gray-500 text-center py-8">No experience added yet. Click "Add Experience" to get started.</p>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-semibold text-gray-500">Education #{index + 1}</span>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  className="col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Degree (e.g., Bachelor's)"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="month"
                  placeholder="Graduation Date"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  className="col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          ))}
          {resumeData.education.length === 0 && (
            <p className="text-gray-500 text-center py-8">No education added yet. Click "Add Education" to get started.</p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          <textarea
            placeholder="List your skills, separated by commas (e.g., React, Node.js, TypeScript, AWS)"
            value={resumeData.skills.join(', ')}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                skills: e.target.value.split(',').map((s) => s.trim()).filter((s) => s),
              })
            }
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}
