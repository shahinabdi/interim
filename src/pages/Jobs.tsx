// src/pages/Jobs.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { mockJobs, mockCompanies } from '../mock/mockData';
import { JobType, Job } from '../types';
import SearchableDropdown, { Option } from '../components/common/SearchableDropdown';

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const FiltersContainer = styled.div<{ isDark: boolean }>`
  background-color: ${({ isDark }) => (isDark ? '#333' : '#f8f9fa')};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ResultsCount = styled.div`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const JobCard = styled.div<{ isDark: boolean }>`
  background-color: ${({ isDark }) => (isDark ? '#444' : '#fff')};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const JobHeader = styled.div<{ isDark: boolean }>`
  background-color: ${({ isDark }) => (isDark ? '#333' : '#f8f9fa')};
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CompanyLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
`;

const JobTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const CompanyName = styled.p`
  margin: 0.25rem 0 0;
  opacity: 0.8;
`;

const JobBody = styled.div`
  padding: 1.5rem;
`;

const JobLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const JobTypeDisplay = styled.div<{ type: string; isDark: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  background-color: ${({ type, isDark }) => {
    if (type === JobType.FULL_TIME) return isDark ? '#4caf50' : '#e8f5e9';
    if (type === JobType.PART_TIME) return isDark ? '#2196f3' : '#e3f2fd';
    if (type === JobType.CONTRACT) return isDark ? '#ff9800' : '#fff3e0';
    if (type === JobType.TEMPORARY) return isDark ? '#9c27b0' : '#f3e5f5';
    return isDark ? '#607d8b' : '#eceff1';
  }};
  color: ${({ type, isDark }) => {
    if (isDark) return '#fff';
    if (type === JobType.FULL_TIME) return '#2e7d32';
    if (type === JobType.PART_TIME) return '#1565c0';
    if (type === JobType.CONTRACT) return '#e65100';
    if (type === JobType.TEMPORARY) return '#6a1b9a';
    return '#37474f';
  }};
`;

const JobDescription = styled.div`
  margin-bottom: 1.5rem;
`;

const BulletPoints = styled.ul`
  padding-left: 1.25rem;
  margin: 0.5rem 0;
`;

const BulletPoint = styled.li`
  margin-bottom: 0.25rem;
  list-style-type: disc;
`;

const ViewJobButton = styled.a<{ isDark: boolean }>`
  display: block;
  text-align: center;
  padding: 0.75rem;
  background-color: transparent;
  color: ${({ isDark }) => (isDark ? '#90caf9' : '#0d6efd')};
  border: 1px solid ${({ isDark }) => (isDark ? '#90caf9' : '#0d6efd')};
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background-color: ${({ isDark }) => (isDark ? '#90caf9' : '#0d6efd')};
    color: ${({ isDark }) => (isDark ? '#222' : '#fff')};
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #6c757d;
`;

const Jobs: React.FC = () => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const location = useLocation();
  
  // Récupérer les filtres depuis les paramètres d'URL
  const params = new URLSearchParams(location.search);
  console.log("URL params:", location.search);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    keyword: params.get('keyword') || '',
    location: params.get('location') || '',
    jobType: params.get('jobType') || '',
    industry: params.get('industry') || '',
  });
  
  // État pour les jobs filtrés
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  // Options pour les dropdowns
  const jobTypeOptions: Option[] = [
    { value: '', label: 'Tous les types de contrat' },
    { value: JobType.FULL_TIME, label: 'CDI' },
    { value: JobType.CONTRACT, label: 'CDD' },
    { value: JobType.TEMPORARY, label: 'Intérim' },
    { value: JobType.PART_TIME, label: 'Temps partiel' },
    { value: JobType.INTERNSHIP, label: 'Stage' }
  ];
  
  // Générer des options pour les villes
  const locationOptions: Option[] = [
    { value: '', label: 'Toutes les villes' },
    ...Array.from(new Set(mockJobs.map(job => job.location.split(',')[0].trim())))
      .map(location => ({
        value: location,
        label: location
      }))
  ];
  
  // Options pour le filtrage par secteur d'activité
  const industryOptions: Option[] = [
    { value: '', label: 'Tous les secteurs' },
    ...Array.from(new Set(mockCompanies.map(company => company.industry)))
      .map(industry => ({
        value: industry,
        label: industry
      }))
  ];
  
  // Effet pour filtrer les jobs quand les filtres changent
  useEffect(() => {
    let results = mockJobs;
    
    // Filtrer par mot-clé
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.description.toLowerCase().includes(keyword) ||
        job.company.name.toLowerCase().includes(keyword) ||
        job.requirements.some(req => req.toLowerCase().includes(keyword))
      );
    }
    
    // Filtrer par lieu
    if (filters.location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filtrer par type de contrat
    if (filters.jobType) {
      results = results.filter(job => job.type === filters.jobType);
    }
    
    // Filtrer par secteur d'activité
    if (filters.industry) {
      results = results.filter(job => 
        job.company.industry.toLowerCase() === filters.industry.toLowerCase()
      );
    }
    
    // Mettre à jour les jobs filtrés
    setFilteredJobs(results);
    
    // Mettre à jour l'URL avec les nouveaux filtres
    const params = new URLSearchParams();
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.location) params.set('location', filters.location);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.industry) params.set('industry', filters.industry);
    
    window.history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
  }, [filters, location.pathname]);
  
  // Gestionnaire pour mettre à jour les filtres
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <PageContainer>
      <PageTitle>Offres d'emploi</PageTitle>
      
      <FiltersContainer isDark={isDark}>
        <FilterGroup>
          <SearchableDropdown
            options={[]}
            placeholder="Titre du poste, compétences ou entreprise"
            value={filters.keyword}
            onChange={(value) => handleFilterChange('keyword', value)}
            onSearch={(term) => handleFilterChange('keyword', term)}
          />
        </FilterGroup>
        
        <FilterGroup>
          <SearchableDropdown
            options={locationOptions}
            placeholder="Ville ou région"
            value={filters.location}
            onChange={(value) => handleFilterChange('location', value)}
          />
        </FilterGroup>
        
        <FilterGroup>
          <SearchableDropdown
            options={jobTypeOptions}
            placeholder="Type de contrat"
            value={filters.jobType}
            onChange={(value) => handleFilterChange('jobType', value)}
          />
        </FilterGroup>
        
        <FilterGroup>
          <SearchableDropdown
            options={industryOptions}
            placeholder="Secteur d'activité"
            value={filters.industry}
            onChange={(value) => handleFilterChange('industry', value)}
          />
        </FilterGroup>
      </FiltersContainer>
      
      <ResultsCount>
        {filteredJobs.length} offre(s) trouvée(s)
      </ResultsCount>
      
      {filteredJobs.length > 0 ? (
        <JobsGrid>
          {filteredJobs.map(job => (
            <JobCard key={job.id} isDark={isDark}>
              <JobHeader isDark={isDark}>
                <CompanyLogo src={job.company.logo || 'https://placehold.co/48'} alt={job.company.name} />
                <div>
                  <JobTitle>{job.title}</JobTitle>
                  <CompanyName>{job.company.name}</CompanyName>
                </div>
              </JobHeader>
              
              <JobBody>
                <JobLocation>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  {job.location}
                </JobLocation>
                
                <JobTypeDisplay type={job.type} isDark={isDark}>
                  {job.type === JobType.FULL_TIME && 'CDI'}
                  {job.type === JobType.PART_TIME && 'Temps partiel'}
                  {job.type === JobType.CONTRACT && 'CDD'}
                  {job.type === JobType.TEMPORARY && 'Intérim'}
                  {job.type === JobType.INTERNSHIP && 'Stage'}
                </JobTypeDisplay>
                
                <JobDescription>
                  <BulletPoints>
                    {job.type === JobType.FULL_TIME && (
                      <>
                        <BulletPoint>Poste à temps plein en CDI</BulletPoint>
                        <BulletPoint>Expérience avec {job.title.includes('Frontend') ? 'React et TypeScript' : job.title.includes('Backend') ? 'Node.js et Express' : 'Python et Data Analysis'}</BulletPoint>
                        <BulletPoint>Travail au sein d'une équipe dynamique et collaborative</BulletPoint>
                      </>
                    )}
                    {job.type === JobType.CONTRACT && (
                      <>
                        <BulletPoint>Contrat à durée déterminée (CDD)</BulletPoint>
                        <BulletPoint>Expérience avec les technologies requises</BulletPoint>
                        <BulletPoint>Projets innovants et stimulants</BulletPoint>
                      </>
                    )}
                    {job.type === JobType.TEMPORARY && (
                      <>
                        <BulletPoint>Mission d'intérim de 3 à 6 mois</BulletPoint>
                        <BulletPoint>Compétences en {job.title.split(' ')[0]}</BulletPoint>
                        <BulletPoint>Possibilité de prolongation</BulletPoint>
                      </>
                    )}
                    {(job.type === JobType.PART_TIME || job.type === JobType.INTERNSHIP) && (
                      <>
                        <BulletPoint>Travail flexible et adapté</BulletPoint>
                        <BulletPoint>Formation et mentorat inclus</BulletPoint>
                        <BulletPoint>Environnement de travail stimulant</BulletPoint>
                      </>
                    )}
                  </BulletPoints>
                </JobDescription>
                
                <ViewJobButton href={`/jobs/${job.id}`} isDark={isDark}>
                  Voir l'offre
                </ViewJobButton>
              </JobBody>
            </JobCard>
          ))}
        </JobsGrid>
      ) : (
        <NoResults>
          Aucune offre ne correspond à vos critères. Veuillez modifier vos filtres.
        </NoResults>
      )}
    </PageContainer>
  );
};

export default Jobs;